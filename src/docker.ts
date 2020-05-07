class Docker {
  readonly repository = 'renovate/renovate';
  // renovate: datasource=docker depName=renovate/renovate versioning=docker
  readonly tag = '19.231.9';

  image(): string {
    return `${this.repository}:${this.tag}`;
  }

  version(): string {
    return this.tag;
  }
}

export default Docker;
