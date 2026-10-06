import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';
import {findObliqueRootPath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

const rootPath = findObliqueRootPath();

Log.start('Lint CLI registry project');
Lint.initialize(hasFlag('fix'))
	.esLint(Files.buildOSSafePath(`${rootPath}/tools/cli-registry/{src,scripts}/**/*.{ts,mjs}`), rootPath)
	.prettier([
		Files.buildOSSafePath(`${rootPath}/tools/cli-registry/{src,scripts}/**/*.{ts,json,yml,yaml,md}`),
		Files.buildOSSafePath(`${rootPath}/tools/cli-registry/*.{json,yml,yaml,md,mjs}`),
	])
	.finalize();
Log.success();
