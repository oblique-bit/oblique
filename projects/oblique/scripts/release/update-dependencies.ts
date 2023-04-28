import {execSync} from 'child_process';
import {Commit} from './commit';

execSync('npm update --save --audit false', {stdio: 'inherit'});
execSync('npm audit fix', {stdio: 'inherit'});
execSync('npm dedupe --audit false', {stdio: 'inherit'});
execSync('npm prune --audit false', {stdio: 'inherit'});
Commit.perform('chore(toolchain): update dependencies and refactor accordingly');
