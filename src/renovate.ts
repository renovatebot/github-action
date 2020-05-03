import Docker from './docker';
import child from 'child_process';

class Renovate {
  private configurationFileEnv = 'RENOVATE_CONFIG_FILE';
  private tokenEnv = 'RENOVATE_CONFIG_FILE';

  private docker: Docker;

  constructor(private configurationFile: string, private token: string) {
    this.docker = new Docker();
  }

  runDockerContainer(): void {
    const commandArguments = [
      '--rm',
      this.docker.image(),
      `--env ${this.configurationFileEnv}='${this.configurationFile}`,
      `--env ${this.tokenEnv}='${this.token}`,
    ];
    const command = `docker run ${commandArguments.join(' ')}`;

    child.execSync(command, { stdio: 'inherit' });
  }
}

export default Renovate;
