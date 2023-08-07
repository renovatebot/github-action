import Docker from './docker';
import { Input } from './input';
import { exec } from '@actions/exec';
import fs from 'fs';
import path from 'path';

class Renovate {
  static dockerGroupRegex = /^docker:x:(?<groupId>[1-9][0-9]*):/m;
  private configFileMountDir = '/github-action';

  private docker: Docker;

  constructor(private input: Input) {
    this.validateArguments();

    this.docker = new Docker(input);
  }

  async runDockerContainer(): Promise<void> {
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
        `--volume ${configurationFile.value}:${mountPath}`
      );
    }

    if (this.input.mountDockerSocket()) {
      dockerArguments.push(
        '--volume /var/run/docker.sock:/var/run/docker.sock',
        `--group-add ${this.getDockerGroupId()}`
      );
    }

    const docker_cmd_file = this.input.getDockerCmdFile();
    let docker_cmd = null;
    if (docker_cmd_file !== null) {
      const baseName = path.basename(docker_cmd_file);
      const mountPath = path.join('/', baseName);
      dockerArguments.push(`--volume ${docker_cmd_file}:${mountPath}`);
      docker_cmd = mountPath;
    }

    const docker_user = this.input.getDockerUser();
    if (docker_user !== null) {
      dockerArguments.push(`--user ${docker_user}`);
    }

    dockerArguments.push('--volume /tmp:/tmp', '--rm', this.docker.image());

    if (docker_cmd !== null) {
      dockerArguments.push(docker_cmd);
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
    const match = Renovate.dockerGroupRegex.exec(groups);
    if (match?.groups?.groupId === undefined) {
      throw new Error(`Could not find group docker in ${groupFile}`);
    }

    return match.groups.groupId;
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
