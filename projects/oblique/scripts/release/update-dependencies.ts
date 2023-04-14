import {execSync} from 'child_process';
import {Commit} from './commit';

execSync('npm update --save --audit false');
execSync('npm audit fix');
execSync('npm dedupe --audit false');
execSync('npm prune --audit false');
Commit.perform('chore(toolchain): update dependencies and refactor accordingly');
