import {Lint} from '../../../scripts/shared/lint';
import {hasFlag} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start('Lint Design System project');
Lint.initialize(hasFlag('fix'))
	.esLint('**/*.{ts,js,html}', '.eslintrc.local.yml')
	.styleLint('**/*.{css,scss}')
	.prettier('**/*.{ts,js,html,json,yml,md,css,scss}')
	.finalize();
Log.success();
