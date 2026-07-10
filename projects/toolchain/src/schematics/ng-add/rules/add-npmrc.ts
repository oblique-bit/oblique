import {type Rule, type Tree, chain, move, template} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../../shared/template/template';

const npmrcFile = '.npmrc';

function addNpmrc(logger: ObGroupLogger, shouldAdd = false): Rule {
	return (tree: Tree) => {
		if (!shouldAdd || tree.exists(npmrcFile)) {
			return tree;
		}
		logger.step(`Create ${npmrcFile} file at project root`);
		return chain([createFromTemplate('./templates/add-npmrc', [template({})]), move('npmrc', npmrcFile)]);
	};
}

export default addNpmrc;
