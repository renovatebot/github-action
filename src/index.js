// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

const cfg = process.env[`INPUT_CONFIGURATIONFILE`];
const token = process.env[`INPUT_TOKEN`];
const ws = process.env.GITHUB_WORKSPACE;

console.dir(process.env);

execSync(`bash -c ${ws}/src/entrypoint.sh '${cfg}' '${token}'`);
