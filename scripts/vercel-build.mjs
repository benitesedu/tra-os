import { cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const build = spawnSync(npm, ['run', 'build', '-w', '@tracos/play'], { stdio: 'inherit', shell: process.platform === 'win32' });

if (build.status !== 0) process.exit(build.status ?? 1);

rmSync('.next', { recursive: true, force: true });
rmSync('public', { recursive: true, force: true });
cpSync('apps/play/.next', '.next', { recursive: true });
cpSync('apps/play/public', 'public', { recursive: true });
