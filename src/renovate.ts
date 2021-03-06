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
    const renovateDockerUser = 'ubuntu';

    const dockerArguments = [
      ...this.input.toEnvironmentVariables(),
      {
        key: this.input.options.configurationFile.env,
        value: this.configFileMountPath(),
      },
    ]
      .map((e) => {
        const quotedValue = /\s/.test(e.value) ? `'${e.value}'` : e.value;
        return `--env ${e.key}=${quotedValue}`;
      })
      .concat([
        `--volume ${this.input.configurationFile()}:${this.configFileMountPath()}`,
        '--volume /var/run/docker.sock:/var/run/docker.sock',
        '--volume /tmp:/tmp',
        `--user ${renovateDockerUser}:${this.getDockerGroupId()}`,
        '--rm',
        this.docker.image(),
      ]);

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
    if (!fs.existsSync(this.input.configurationFile())) {
      throw new Error(
        `Could not locate configuration file '${this.input.configurationFile()}'.`
      );
    }
  }

  private configFileName(): string {
    return path.basename(this.input.configurationFile());
  }

  private configFileMountPath(): string {
    return path.join(this.configFileMountDir, this.configFileName());
  }
}

export default Renovate;
