import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {closeLogger} from '../shared/logger-close';
import {addBrowserslistrc} from './rules/add-browserslistrc';
import type {NgAddOptions} from './types';
import addNpmrc from './rules/add-npmrc';

export function toolchain(options: NgAddOptions): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context).group('Add @oblique/toolchain');
		return chain([addBrowserslistrc(logger), addNpmrc(logger, options.npmrc), closeLogger(logger)])(tree, context);
	};
}
