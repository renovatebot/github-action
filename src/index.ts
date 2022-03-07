import * as core from '@actions/core';
import Input from './input';
import Renovate from './renovate';

async function run(): Promise<void> {
  try {
    const input = new Input();
    const renovate = new Renovate(input);

    await renovate.runDockerContainer();
  } catch (error) {
    console.error(error);
    core.setFailed(error as Error);
  }
}

void run();
