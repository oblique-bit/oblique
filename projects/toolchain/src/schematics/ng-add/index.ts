import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {closeLogger} from '../shared/logger-close';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';

export function toolchain(): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context).group('Add @oblique/toolchain');
		return chain([addBrowserslistrc(logger), closeLogger(logger)])(tree, context);
	};
}
