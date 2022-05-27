import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, createSafeRule, infoMigration, replaceInFile} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV8Schema {}

export class UpdateV8toV9 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV8Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			return chain([this.renameTranslationKeys()])(tree, _context);
		};
	}

	private renameTranslationKeys(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming Oblique translation keys');
			const apply = (filePath: string): void => {
				[
					'progressBar',
					'mainContent',
					'checkAll',
					'uncheckAll',
					'searchPlaceholder',
					'defaultTitle',
					'allSelected',
					'offCanvas',
					'topControl',
					'noResults'
				].forEach(key => replaceInFile(tree, filePath, new RegExp(`(?<=i18n\\.oblique[\\w.-]*)${key}`, 'g'), this.toKebabCase(key)));
			};
			return applyInTree(tree, apply, '*.{html,ts,json}');
		});
	}

	private toKebabCase(input: string): string {
		return (
			input
				?.match(/[A-Z]?[a-z]+/g)
				?.map(match => match.toLowerCase())
				?.join('-') ?? ''
		);
	}
}
