import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';

Lint.initialize(hasFlag('fix'))
	.esLint('**/*.{ts,js,html}', '.eslintrc.local.yml')
	.styleLint('**/*.{css,scss}')
	.prettier('**/*.{ts,js,html,json,yml,md,css,scss}')
	.finalize();
