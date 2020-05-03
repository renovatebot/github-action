import Docker from './docker';
import child from 'child_process';

class Renovate {
  private configurationFileEnv = 'RENOVATE_CONFIG_FILE';
  private tokenEnv = 'RENOVATE_TOKEN';

  private docker: Docker;

  constructor(private configurationFile: string, private token: string) {
    this.docker = new Docker();
  }

  runDockerContainer(): void {
    const commandArguments = [
      '--rm',
      `--env ${this.configurationFileEnv}='${this.configurationFile}'`,
      `--env ${this.tokenEnv}='${this.token}'`,
      this.docker.image(),
    ];
    const command = `docker run ${commandArguments.join(' ')}`;

    child.execSync(command, { stdio: 'inherit' });
  }
}

export default Renovate;
