import {hasFlag} from './shared/utils';
import {Lint} from './shared/lint';
import {Log} from './shared/log';

Log.start('Lint non project files');
const fileTypes = '{ts,js,html,json,yml,md,css,scss}';
Lint.initialize(hasFlag('fix'))
	.esLint('{scripts,tests}/**/*')
	.prettier([`{scripts,tests}/**/*.${fileTypes}`, `*.${fileTypes}`]);
Log.success();
