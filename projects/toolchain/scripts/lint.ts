import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';
import {findObliqueRootPath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

const rootPath = findObliqueRootPath();

Log.start('Lint Toolchain project');
Lint.initialize(hasFlag('fix'))
	.esLint(Files.buildOSSafePath(`${rootPath}/projects/toolchain/**/*.{ts,js,mjs}`), rootPath)
	.prettier(Files.buildOSSafePath(`${rootPath}/projects/toolchain/**/*.{ts,js,mjs,json,yml,md}`))
	.finalize();
Log.success();
