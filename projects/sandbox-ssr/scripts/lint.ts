import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';

Log.start('Lint Sandbox SSR project');
Lint.initialize(hasFlag('fix'))
	.esLint('projects/sandbox-ssr/**/*.{ts,js,mjs,html}', '../..')
	.styleLint('**/*.{css,scss}')
	.prettier('**/*.{ts,js,mjs,html,json,yml,md,css,scss}')
	.finalize();
Log.success();
