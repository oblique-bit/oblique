import {Commit} from '../../../../scripts/commit';

Commit.perform(`chore(toolchain): release version ${process.env.npm_package_version}`);
