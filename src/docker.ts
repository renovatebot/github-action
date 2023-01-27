import type { Input } from './input';

class Docker {
  readonly repository = 'renovate/renovate';
  // renovate: datasource=docker depName=renovate/renovate versioning=docker
  readonly tag = '34.115.0-slim';
  readonly tagSuffix = '-slim';
  readonly fullTag: string;

  constructor(private input: Input) {
    this.fullTag = input.useSlim() ? this.tag : this.tag.replace(this.tagSuffix, '');
  }

  image(): string {
    return `${this.repository}:${this.fullTag}`;
  }

  version(): string {
    return this.fullTag;
  }
}

export default Docker;
