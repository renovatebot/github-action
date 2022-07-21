import { Input } from './input';

class Docker {
  readonly repository = 'renovate/renovate';
  // renovate: datasource=docker depName=renovate/renovate versioning=docker
  readonly tag = '34.82.0-slim';
  readonly tagSuffix = '-slim';
  readonly fullTag: string;

  constructor(private input: Input) {
    this.fullTag = input.useSlim() ? this.tag : this.version();
  }

  image(): string {
    return `${this.repository}:${this.fullTag}`;
  }

  version(): string {
    return this.tag.replace(this.tagSuffix, '');
  }
}

export default Docker;
