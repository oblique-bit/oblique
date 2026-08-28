import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {obCreateSchematicsLogger} from '../../logger';
import {i18n} from '../i18n/index';
import {closeLogger} from '../shared/logger-close';
import {addFavicon} from './rules/add-favicon';
import type {AddObliqueOptions} from './types';

export function addOblique(options: AddObliqueOptions): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const logger = obCreateSchematicsLogger(context, options.silent).group('Generate @oblique/toolchain:add-oblique');
		const locales = options.locale.trim().split(/\s+/u).filter(Boolean);
		return chain([addFavicon(logger), i18n({locales, silent: options.silent}), closeLogger(logger)])(tree, context);
	};
}
