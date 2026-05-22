import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {closeLogger} from '../shared/logger-close';
import {removeExistingLinting} from './rules/remove-existing-linting';
import {adaptLintingConfiguration} from './rules/adapt-linting-configuration';
import {installAngularEslint} from './rules/install-angular-eslint';
import type {ObLintingSchemaOptions} from './types';

export function linting(options: ObLintingSchemaOptions): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context, options.silent).group('Add linting solution');
		return chain([
			removeExistingLinting(logger),
			installAngularEslint(logger),
			adaptLintingConfiguration(logger, options.prefix),
			closeLogger(logger),
		])(tree, context);
	};
}
