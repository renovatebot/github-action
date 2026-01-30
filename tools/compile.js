import { build } from 'esbuild';
import { env } from 'node:process';

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node24',
  minify: !!env['CI'],
  tsconfig: 'tsconfig.dist.json',
  sourcemap: true,
  format: 'esm',
  outdir: './dist/',
  inject: ['tools/cjs-shim.ts'], // https://github.com/evanw/esbuild/issues/1921#issuecomment-1898197331
});
