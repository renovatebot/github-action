import type { Input } from './input';

class Docker {
  private readonly dockerImage: string;
  private readonly fullTag: string;

  constructor(input: Input) {
    const tag = input.getVersion();

    this.dockerImage = input.getDockerImage()
    this.fullTag = input.useSlim()
      ? tag
        ? `${tag}-slim`
        : 'slim'
      : tag ?? 'latest';
  }

  image(): string {
    return `${this.dockerImage}:${this.fullTag}`;
  }
}

export default Docker;
