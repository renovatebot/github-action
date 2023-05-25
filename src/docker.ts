import type { Input } from './input';

class Docker {
  private static readonly image = 'ghcr.io/renovatebot/renovate';

  private readonly dockerImage: string;
  private readonly fullTag: string;

  constructor(input: Input) {
    this.dockerImage = input.getDockerImage() ?? Docker.image;

    const tag = input.getVersion();
    const slim = input.useSlim();

    if (tag === 'latest' || tag === 'slim') {
      this.fullTag = tag;
    } else if (!tag) {
      this.fullTag = slim ? 'slim' : 'latest';
    } else {
      this.fullTag = slim && !tag.endsWith('-slim') ? `${tag}-slim` : tag;
    }
  }

  image(): string {
    return `${this.dockerImage}:${this.fullTag}`;
  }
}

export default Docker;
