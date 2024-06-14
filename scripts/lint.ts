import {hasFlag} from './shared/utils';
import {Lint} from './shared/lint';

const fileTypes = '{ts,js,html,json,yml,md,css,scss}';
Lint.initialize(hasFlag('fix'))
	.esLint('{scripts,tests}/**/*')
	.prettier([`{scripts,tests}/**/*.${fileTypes}`, `*.${fileTypes}`]);
