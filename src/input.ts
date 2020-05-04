import * as core from '@actions/core';

class Input {
  readonly configurationFile = core.getInput('configurationFile', {
    required: true,
  });
  readonly token = core.getInput('token', { required: true });

  constructor() {
    this.validate();
  }

  validate(): void {
    if (this.token === '') {
      throw new Error('input.token MUST NOT be empty');
    }
  }
}

export default Input;
