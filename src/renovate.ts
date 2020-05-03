import Docker from './docker';
import child from 'child_process';
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

  runDockerContainer(): void {
    const commandArguments = [
      '--rm',
      `--env ${this.configFileEnv}='${this.configFileMountPath()}'`,
      `--env ${this.tokenEnv}='${this.token}'`,
      `--volume ${this.configFile}:${this.configFileMountPath()}`,
      this.docker.image(),
    ];
    const command = `docker run ${commandArguments.join(' ')}`;
    // console.log(commandArguments, command);

    child.execSync(command, { stdio: 'inherit' });
  }

  private validateArguments(): void {
    if (!fs.existsSync(this.configFile)) {
      throw new Error(
        `Could not locate configuration file '${this.configFile}'.`,
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
