import type { Input } from './input';

class Docker {
  private static readonly repository = 'renovate/renovate';
  private readonly fullTag: string;

  constructor(input: Input) {
    const tag = input.getVersion();
    this.fullTag = input.useSlim()
      ? tag
        ? `${tag}-slim`
        : 'slim'
      : tag ?? 'latest';
  }

  image(): string {
    return `${Docker.repository}:${this.fullTag}`;
  }
}

export default Docker;
