import {Commit} from './commit';

Commit.perform(`chore(toolchain): release version ${process.env.npm_package_version}`);
