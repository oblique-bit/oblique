import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {closeLogger} from '../shared/logger-close';
import {addFavicon} from './rules/add-favicon';

export function addOblique(): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context).group('Generate @oblique/toolchain:add-oblique');
		return chain([addFavicon(logger), closeLogger(logger)])(tree, context);
	};
}
