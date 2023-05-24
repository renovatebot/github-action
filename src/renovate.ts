import Docker from './docker';
import { Input } from './input';
import { exec } from '@actions/exec';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class Renovate {
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

    dockerArguments.push('--volume /tmp:/tmp', '--rm', this.docker.image());

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
    const groupInfo = execSync(`getent group docker`)
      .toString()
      .trim()
      .split(':');
    if (groupInfo.length < 3) {
      throw new Error(`Could not find docker group ID`);
    }
    return groupInfo[2];
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
