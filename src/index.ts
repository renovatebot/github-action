import * as core from '@actions/core';
import Input from './input';
import Renovate from './renovate';

function run(): Promise<void> {
  const input = new Input();
  const renovate = new Renovate(input.configurationFile, input.token);

  return renovate.runDockerContainer();
}

run().catch((error) => {
  console.error(error);
  core.setFailed(error.message);
});
