import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';
import {findObliqueRootPath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

const rootPath = findObliqueRootPath();

Log.start('Lint Sandbox project');
Lint.initialize(hasFlag('fix'))
	.esLint(Files.buildOSSafePath(`${rootPath}/projects/sandbox/**/*.{ts,js,mjs,html}`), rootPath)
	.styleLint(Files.buildOSSafePath(`${rootPath}/projects/sandbox/**/*.{css,scss}`))
	.prettier(Files.buildOSSafePath(`${rootPath}/projects/sandbox/**/*.{ts,js,mjs,html,json,yml,md,css,scss}`))
	.finalize();
Log.success();
