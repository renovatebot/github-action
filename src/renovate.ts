import Docker from './docker';
import { Input } from './input';
import { exec } from '@actions/exec';
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

    dockerArguments.push('--volume /tmp:/tmp', '--rm', this.docker.image());

    const command = `docker run ${dockerArguments.join(' ')}`;

    const code = await exec(command);
    if (code !== 0) {
      new Error(`'docker run' failed with exit code ${code}.`);
    }
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
