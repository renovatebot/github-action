import type { Input } from './input';

class Docker {
  private static readonly image = 'ghcr.io/renovatebot/renovate';

  private readonly dockerImage: string;
  private readonly fullTag: string;

  constructor(input: Input) {
    const tag = input.getVersion();

    this.dockerImage = input.getDockerImage() ?? Docker.image;
    this.fullTag = input.useSlim()
      ? tag
        ? `${tag}-slim`
        : 'slim'
      : tag ?? 'full';
  }

  image(): string {
    return `${this.dockerImage}:${this.fullTag}`;
  }
}

export default Docker;
