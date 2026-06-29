import {type Rule, type Tree, template} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../../shared/template/template';

export function addBrowserslistrc(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		const browserslistrcFileName = '.browserslistrc';
		if (tree.exists(browserslistrcFileName)) {
			return tree;
		}

		logger.step(`Create "${browserslistrcFileName}" file`);
		return createFromTemplate('./templates', [template({})]);
	};
}
