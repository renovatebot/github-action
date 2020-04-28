// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

execSync(`bash -c ${process.env.GITHUB_WORKSPACE}/src/entrypoint.sh`, {
  stdio: 'inherit',
});
