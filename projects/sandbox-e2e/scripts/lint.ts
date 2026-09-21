import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';
import {findObliqueRootPath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

const rootPath = findObliqueRootPath();

Log.start('Lint Sandbox E2E project');
Lint.initialize(hasFlag('fix'))
	.esLint(Files.buildOSSafePath(`${rootPath}/projects/sandbox-e2e/**/*.{ts,js,mjs,html}`), rootPath)
	.prettier(Files.buildOSSafePath(`${rootPath}/projects/sandbox-e2e/**/*.{ts,js,mjs,html,json,yml,md,css,scss}`))
	.finalize();
Log.success();
