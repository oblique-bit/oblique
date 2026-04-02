import type {Rule, Tree} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../utils';

const browserslistrcFileName = '.browserslistrc';

export function addBrowserslistrc(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		if (tree.exists(browserslistrcFileName)) {
			return tree;
		}
		logger.step(`Create "${browserslistrcFileName}" file`);
		return createFromTemplate(browserslistrcFileName, browserslistrcFileName, tree);
	};
}
