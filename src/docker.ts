import type { Input } from './input';
import { warning } from '@actions/core';

export class Docker {
  private static readonly image = 'ghcr.io/renovatebot/renovate';
  private static readonly version = '40'; // renovate

  private readonly dockerImage: string;
  private readonly fullTag: string;

  constructor(input: Input) {
    let image = input.getDockerImage();
    let version = input.getVersion();

    if (!image) {
      warning(`No Docker image specified, using ${Docker.image}`);
      image = Docker.image;
    }
    if (!version) {
      warning(`No Docker version specified, using ${Docker.version}`);
      version = Docker.version;
    }

    this.dockerImage = image;
    this.fullTag = version;
  }

  image(): string {
    return `${this.dockerImage}:${this.fullTag}`;
  }
}
