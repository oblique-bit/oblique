import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';

Log.start('Lint Toolchain project');
Lint.initialize(hasFlag('fix'))
	.esLint('projects/cli/**/*.{ts,js,mjs}', '../..')
	.prettier('**/*.{ts,js,mjs,json,yml,md}')
	.finalize();
Log.success();
