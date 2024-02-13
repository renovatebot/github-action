import Docker from './docker';
import { Input } from './input';
import { exec } from '@actions/exec';
import fs from 'fs/promises';
import path from 'path';

class Renovate {
  static dockerGroupRegex = /^docker:x:(?<groupId>[1-9][0-9]*):/m;
  private configFileMountDir = '/github-action';

  private docker: Docker;

  constructor(private input: Input) {
    this.docker = new Docker(input);
  }

  async runDockerContainer(): Promise<void> {
    await this.validateArguments();

    const dockerArguments = this.input
      .toEnvironmentVariables()
      .map((e) => `--env ${e.key}`)
      .concat([`--env ${this.input.token.key}=${this.input.token.value}`]);

    const configurationFile = this.input.configurationFile();
    if (configurationFile !== null) {
      const baseName = path.basename(configurationFile.value);
      const mountPath = path.join(this.configFileMountDir, baseName);
      dockerArguments.push(
        `--env ${configurationFile.key}=${mountPath}`,
        `--volume ${configurationFile.value}:${mountPath}`,
      );
    }

    if (this.input.mountDockerSocket()) {
      dockerArguments.push(
        '--volume /var/run/docker.sock:/var/run/docker.sock',
        `--group-add ${await this.getDockerGroupId()}`,
      );
    }

    const dockerCmdFile = this.input.getDockerCmdFile();
    let dockerCmd: string | null = null;
    if (dockerCmdFile !== null) {
      const baseName = path.basename(dockerCmdFile);
      const mountPath = `/${baseName}`;
      dockerArguments.push(`--volume ${dockerCmdFile}:${mountPath}`);
      dockerCmd = mountPath;
    }

    const dockerUser = this.input.getDockerUser();
    if (dockerUser !== null) {
      dockerArguments.push(`--user ${dockerUser}`);
    }

    for (const volumeMount of this.input.getDockerVolumeMounts()) {
      dockerArguments.push(`--volume ${volumeMount}`);
    }

    dockerArguments.push('--rm', this.docker.image());

    if (dockerCmd !== null) {
      dockerArguments.push(dockerCmd);
    }

    const command = `docker run ${dockerArguments.join(' ')}`;

    const code = await exec(command);
    if (code !== 0) {
      new Error(`'docker run' failed with exit code ${code}.`);
    }
  }

  /**
   * Fetch the host docker group of the GitHub Action runner.
   *
   * The Renovate container needs access to this group in order to have the
   * required permissions on the Docker socket.
   */
  private async getDockerGroupId(): Promise<string> {
    const groupFile = '/etc/group';
    const groups = await fs.readFile(groupFile, {
      encoding: 'utf-8',
    });

    /**
     * The group file has `groupname:group-password:GID:username-list` as
     * structure and we're interested in the `GID` (the group ID).
     *
     * Source: https://www.thegeekdiary.com/etcgroup-file-explained/
     */
    const match = Renovate.dockerGroupRegex.exec(groups);
    if (match?.groups?.groupId === undefined) {
      throw new Error(`Could not find group docker in ${groupFile}`);
    }

    return match.groups.groupId;
  }

  private async validateArguments(): Promise<void> {
    if (/\s/.test(this.input.token.value)) {
      throw new Error('Token MUST NOT contain whitespace');
    }
    await this.validateConfigFileArgument();
    await this.validateDockerCmdFileArgument();
  }

  private async validateConfigFileArgument(): Promise<void> {
    const configurationFile = this.input.configurationFile();
    if (
      configurationFile !== null &&
      !(await fs.stat(configurationFile.value)).isFile()
    ) {
      throw new Error(
        `configuration file '${configurationFile.value}' MUST be an existing file`,
      );
    }
  }

  private async validateDockerCmdFileArgument(): Promise<void> {
    const dockerCmdFile = this.input.getDockerCmdFile();
    if (dockerCmdFile !== null) {
      if (
        !fs.existsSync(dockerCmdFile) ||
        !fs.statSync(dockerCmdFile).isFile()
      ) {
        throw new Error(
          `dockerCmdFile '${dockerCmdFile}' MUST be an existing file`,
        );
      }
      try {
        fs.accessSync(dockerCmdFile, fs.constants.R_OK | fs.constants.X_OK);
      } catch {
        throw new Error(
          `dockerCmdFile '${dockerCmdFile}' MUST have read and execute rights`,
        );
      }
    }
  }
}

export default Renovate;
