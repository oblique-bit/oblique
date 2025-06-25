import type {Rule, Tree} from '@angular-devkit/schematics';
import {createFromTemplate} from '../utils';

const browserslistrcFileName = '.browserslistrc';

export function addBrowserslistrc(): Rule {
	return (tree: Tree) => {
		if (tree.exists(browserslistrcFileName)) {
			return tree;
		}
		return createFromTemplate(browserslistrcFileName, browserslistrcFileName, tree);
	};
}
