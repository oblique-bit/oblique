import {hasFlag} from './shared/utils';
import {Lint} from './shared/lint';
import {Log} from './shared/log';
import {findRootPath} from './shared/root';

const rootPath = findRootPath();

Log.start('Lint non project files');
const fileTypes = '{ts,js,mjs,html,json,yml,md,css,scss}';
Lint.initialize(hasFlag('fix'))
	.esLint(`${rootPath}/{scripts,tests}/**/*`)
	.prettier([`${rootPath}/{scripts,tests}/**/*.${fileTypes}`, `*.${fileTypes}`]);
Log.success();
