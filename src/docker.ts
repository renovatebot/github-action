import type { Input } from './input';

// renovate: datasource=docker depName=renovate/renovate versioning=docker
const tag = '34.149.0-slim';

class Docker {
  private static readonly repository = 'renovate/renovate';
  private static readonly tagSuffix = '-slim';
  private readonly fullTag: string;

  constructor(input: Input) {
    this.fullTag = input.useSlim() ? tag : tag.replace(Docker.tagSuffix, '');
  }

  image(): string {
    return `${Docker.repository}:${this.fullTag}`;
  }

  static version(): string {
    return tag.replace(Docker.tagSuffix, '');
  }
}

export default Docker;
