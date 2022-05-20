import {execSync} from 'child_process';

execSync(`git commit -am "chore(toolchain): release version ${process.env.npm_package_version}"`);
