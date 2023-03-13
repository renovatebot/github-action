import * as core from '@actions/core';
import path from 'path';

interface EnvironmentVariable {
  key: string;
  value: string;
}

class Input {
  readonly options = {
    envRegex: /^(?:RENOVATE_\w+|LOG_LEVEL|GITHUB_COM_TOKEN|NODE_OPTIONS)$/,
    configurationFile: {
      input: 'configurationFile',
      env: 'RENOVATE_CONFIG_FILE',
      optional: true,
    },
    token: {
      input: 'token',
      env: 'RENOVATE_TOKEN',
      optional: false,
    },
  } as const;
  readonly token: Readonly<EnvironmentVariable>;

  private readonly _environmentVariables: Map<string, string>;
  private readonly _configurationFile: Readonly<EnvironmentVariable>;

  constructor() {
    const envRegexInput = core.getInput('env-regex');
    const envRegex = envRegexInput
      ? new RegExp(envRegexInput)
      : this.options.envRegex;
    this._environmentVariables = new Map(
      Object.entries(process.env).filter(([key]) => envRegex.test(key))
    );

    this.token = this.get(
      this.options.token.input,
      this.options.token.env,
      this.options.token.optional
    );
    this._configurationFile = this.get(
      this.options.configurationFile.input,
      this.options.configurationFile.env,
      this.options.configurationFile.optional
    );
  }

  configurationFile(): EnvironmentVariable | null {
    if (this._configurationFile.value !== '') {
      return {
        key: this._configurationFile.key,
        value: path.resolve(this._configurationFile.value),
      };
    }

    return null;
  }

  useSlim(): boolean {
    return core.getInput('useSlim') !== 'false';
  }

  getVersion(): string | null {
    const version = core.getInput('renovate-version');
    return !!version && version !== '' ? version : null;
  }

  /**
   * Convert to environment variables.
   *
   * @note The environment variables listed below are filtered out.
   * - Token, available with the `token` property.
   * - Configuration file, available with the `configurationFile()` method.
   */
  toEnvironmentVariables(): EnvironmentVariable[] {
    return [...this._environmentVariables].map(([key, value]) => ({
      key,
      value,
    }));
  }

  private get(
    input: string,
    env: string,
    optional: boolean
  ): EnvironmentVariable {
    const fromInput = core.getInput(input);
    const fromEnv = this._environmentVariables.get(env);

    if (fromInput === '' && fromEnv === undefined && !optional) {
      throw new Error(
        [
          `'${input}' MUST be passed using its input or the '${env}'`,
          'environment variable',
        ].join(' ')
      );
    }

    this._environmentVariables.delete(env);
    if (fromInput !== '') {
      return { key: env, value: fromInput };
    }
    return { key: env, value: fromEnv !== undefined ? fromEnv : '' };
  }
}

export default Input;
export { EnvironmentVariable, Input };
