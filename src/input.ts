import * as core from '@actions/core';
import path from 'path';

interface EnvironmentVariable {
  key: string;
  value: string;
}

class Input {
  readonly options = {
    envRegex: /^(?:RENOVATE_\w+|LOG_LEVEL)$/,
    configurationFile: {
      input: 'configurationFile',
      env: 'RENOVATE_CONFIG_FILE',
    },
    token: {
      input: 'token',
      env: 'RENOVATE_TOKEN',
    },
  } as const;

  private readonly _environmentVariables: Map<string, string>;

  constructor() {
    this._environmentVariables = new Map(
      Object.entries(process.env).filter(([key]) =>
        this.options.envRegex.test(key)
      )
    );

    this.setEnvironmentVariable(
      this.options.token.input,
      this.options.token.env
    );
    this.setEnvironmentVariable(
      this.options.configurationFile.input,
      this.options.configurationFile.env
    );
  }

  configurationFile(): string {
    return path.resolve(
      this._environmentVariables.get(this.options.configurationFile.env)
    );
  }

  /**
   * Convert to environment variables.
   *
   * @note The environment variable for the configuration file is filtered out
   * and is available with `configurationFile()` instead.
   */
  toEnvironmentVariables(): EnvironmentVariable[] {
    return [...this._environmentVariables].map(([key, value]) => ({
      key,
      value,
    }));
  }

  private setEnvironmentVariable(input: string, env: string) {
    const optionalInput = core.getInput(input);
    if (optionalInput === '' && !this._environmentVariables.has(env)) {
      throw new Error(
        [
          `'${input}' MUST be passed using its input or the '${env}'`,
          'environment variable',
        ].join(' ')
      );
    }

    if (optionalInput !== '') {
      this._environmentVariables.set(env, optionalInput);
    }
  }
}

export default Input;
export { EnvironmentVariable, Input };
