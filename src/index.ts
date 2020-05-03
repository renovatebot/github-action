import * as core from '@actions/core';
import Input from './input';
import Renovate from './renovate';

try {
  const input = new Input();
  const renovate = new Renovate(input.configurationFile, input.token);
  renovate.runDockerContainer();
} catch (error) {
  console.log(error);
  core.setFailed(error.message);
}
