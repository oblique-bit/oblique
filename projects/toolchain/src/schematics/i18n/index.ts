import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {closeLogger} from '../shared/logger-close';
import addI18n from './rules/add-i18n';
import type {ObI18nSchemaOptions} from './types';

export function i18n(options: ObI18nSchemaOptions): Rule {
	const locales = options.locales;
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context, options.silent).group(
			`Add i18n support with locales [${locales.join(', ')}]`
		);
		return chain([addI18n(logger, options.locales), closeLogger(logger)])(tree, context);
	};
}
