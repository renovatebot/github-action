import Docker from './docker';
import { exec } from '@actions/exec';
import fs from 'fs';
import path from 'path';

class Renovate {
  private configFileEnv = 'RENOVATE_CONFIG_FILE';
  private tokenEnv = 'RENOVATE_TOKEN';
  private configFileMountDir = '/github-action';

  private configFile: string;
  private docker: Docker;

  constructor(configFile: string, private token: string) {
    this.configFile = path.resolve(configFile);

    this.validateArguments();

    this.docker = new Docker();
  }

  async runDockerContainer(): Promise<void> {
    const groups = await fs.promises.readFile('/etc/group', {
      encoding: 'utf-8',
    });
    const [, group] = /^docker:x:([1-9][0-9]*):$/m.exec(groups);
    // await exec('sudo', ['chmod', 'o=rw', '/var/run/docker.sock']);
    const commandArguments = [
      '--rm',
      `--env ${this.configFileEnv}=${this.configFileMountPath()}`,
      `--env ${this.tokenEnv}=${this.token}`,
      `--volume ${this.configFile}:${this.configFileMountPath()}`,
      `-v /var/run/docker.sock:/var/run/docker.sock`,
      `-v /tmp:/tmp`,
      `-u 1000:${group}`,
      this.docker.image(),
    ];
    const command = `docker run ${commandArguments.join(' ')}`;

    const code = await exec(command);
    if (code !== 0) {
      new Error(`'docker run' failed with exit code ${code}.`);
    }
  }

  private validateArguments(): void {
    if (!fs.existsSync(this.configFile)) {
      throw new Error(
        `Could not locate configuration file '${this.configFile}'.`
      );
    }
  }

  private configFileName(): string {
    return path.basename(this.configFile);
  }

  private configFileMountPath(): string {
    return path.join(this.configFileMountDir, this.configFileName());
  }
}

export default Renovate;
