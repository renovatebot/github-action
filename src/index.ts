import { Input } from './input';
import { Renovate } from './renovate';
import { setFailed } from '@actions/core';

async function run(): Promise<void> {
  try {
    const input = new Input();
    const renovate = new Renovate(input);

    await renovate.runDockerContainer();
  } catch (error) {
    console.error(error);
    setFailed(error as Error);
  }
}

void run();
