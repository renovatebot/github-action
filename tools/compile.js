import { build } from 'esbuild';
import { env } from 'node:process';

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  minify: !!env['CI'],
  tsconfig: 'tsconfig.dist.json',
  sourcemap: true,
  format: 'esm',
  outdir: './dist/',
});
