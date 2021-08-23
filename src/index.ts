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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    core.setFailed(error.message);
  }
}

void run();
