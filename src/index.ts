import { group, notice, setFailed } from '@actions/core';
import { Input } from './input';
import { Renovate } from './renovate';

async function run(): Promise<void> {
  try {
    const input = new Input();
    const renovate = new Renovate(input);

    await group('Check Renovate version', async () => {
      const version = await renovate.runDockerContainerForVersion();
      notice(version, { title: 'Renovate CLI version' });
    });

    await renovate.runDockerContainer();
  } catch (error) {
    console.error(error);
    setFailed(error as Error);
  }
}

void run();
