import { info, warning } from '@actions/core';
import type { Input } from './input';

export class Docker {
  private static readonly image = 'ghcr.io/renovatebot/renovate';
  private static readonly version = '44'; // renovate

  private readonly fullImageReference: string;

  constructor(input: Input) {
    let image = input.getDockerImage();
    let version = input.getVersion();

    if (image?.includes(':')) {
      info(
        `Docker image looks like it contains a version, using that as the image itself`,
      );
      this.fullImageReference = image;
      return;
    }

    if (!image) {
      warning(`No Docker image specified, using ${Docker.image}`);
      image = Docker.image;
    }
    if (!version) {
      warning(`No Docker version specified, using ${Docker.version}`);
      version = Docker.version;
    }

    this.fullImageReference = `${image}:${version}`;
  }

  image(): string {
    return this.fullImageReference;
  }
}
