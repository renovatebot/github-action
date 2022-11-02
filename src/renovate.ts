import Docker from './docker';
import { Input } from './input';
import { exec } from '@actions/exec';
import fs from 'fs';
import path from 'path';

class Renovate {
  private dockerGroupName = 'docker';
  private configFileMountDir = '/github-action';

  private docker: Docker;

  constructor(private input: Input) {
    this.validateArguments();

    this.docker = new Docker();
  }

  async runDockerContainer(): Promise<void> {
    const renovateDockerUser = '1001';

    const dockerArguments = this.input
      .toEnvironmentVariables()
      .map((e) => `--env ${e.key}`)
      .concat([`--env ${this.input.token.key}=${this.input.token.value}`]);

    if (this.input.configurationFile() !== null) {
      const baseName = path.basename(this.input.configurationFile().value);
      const mountPath = path.join(this.configFileMountDir, baseName);
      dockerArguments.push(
        `--env ${this.input.configurationFile().key}=${mountPath}`,
        `--volume ${this.input.configurationFile().value}:${mountPath}`
      );
    }

    dockerArguments.push(
      '--volume /var/run/docker.sock:/var/run/docker.sock',
      '--volume /tmp:/tmp',
      `--user ${renovateDockerUser}:${this.getDockerGroupId()}`,
      '--rm',
      this.docker.image()
    );

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
  private getDockerGroupId(): string {
    const groupFile = '/etc/group';
    const groups = fs.readFileSync(groupFile, {
      encoding: 'utf-8',
    });

    /**
     * The group file has `groupname:group-password:GID:username-list` as
     * structure and we're interested in the `GID` (the group ID).
     *
     * Source: https://www.thegeekdiary.com/etcgroup-file-explained/
     */
    const re = new RegExp(`^${this.dockerGroupName}:x:([1-9][0-9]*):`, 'm');
    const match = re.exec(groups);
    if (!match || match.length < 2) {
      throw new Error(
        `Could not find group '${this.dockerGroupName}' in ${groupFile}`
      );
    }

    return match[1];
  }

  private validateArguments(): void {
    if (/\s/.test(this.input.token.value)) {
      throw new Error('Token MUST NOT contain whitespace');
    }

    const configurationFile = this.input.configurationFile();
    if (
      configurationFile !== null &&
      (!fs.existsSync(configurationFile.value) ||
        !fs.statSync(configurationFile.value).isFile())
    ) {
      throw new Error(
        `configuration file '${configurationFile.value}' MUST be an existing file`
      );
    }
  }
}

export default Renovate;
