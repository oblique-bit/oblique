import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';
import {findObliqueRootPath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

const rootPath = findObliqueRootPath();

Log.start('Lint Service Navigation Web Component project');
Lint.initialize(hasFlag('fix'))
	.esLint(
		Files.buildOSSafePath(`${rootPath}/projects/service-navigation-web-component/**/*.{ts,js,mjs,html}`),
		rootPath
	)
	.styleLint(Files.buildOSSafePath(`${rootPath}/projects/service-navigation-web-component/**/*.{css,scss}`))
	.prettier(
		Files.buildOSSafePath(
			`${rootPath}/projects/service-navigation-web-component**/*.{ts,js,mjs,html,json,yml,md,css,scss}`
		)
	)
	.finalize();
Log.success();
