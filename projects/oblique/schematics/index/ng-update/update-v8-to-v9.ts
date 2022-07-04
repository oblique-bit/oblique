import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, createSafeRule, getIndexPaths, infoMigration, overwriteIndexFile, readFile, replaceInFile} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV8Schema {}

export class UpdateV8toV9 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV8Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			return chain([
				this.renameTranslationKeys(),
				this.removeObUseObliqueIconsToken(),
				this.updateBrowserCompatibilityMessages(),
				this.renameJumpLinks(),
				this.useKebabCaseForMixins(),
				this.renameOpened()
			])(tree, _context);
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

	private removeObUseObliqueIconsToken(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove ObUseObliqueIcons is set to true');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /{\s*provide\s*:\s*ObUseObliqueIcons\s*,\s*useValue\s*:\s*true\s*}\s*,?/, '');
				replaceInFile(tree, filePath, /ObUseObliqueIcons\s*,?/, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private updateBrowserCompatibilityMessages(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Oblique: Updating browser compatibility check message');
			getIndexPaths(tree).forEach((indexPath: string) =>
				overwriteIndexFile(indexPath, tree, new RegExp(/<noscript>(?:.|\r?\n)*<\/div>/gm))
			);
			return tree;
		});
	}

	private renameJumpLinks(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Rename jumpLinks into skipLinks');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /ObIJumpLink/g, 'ObISkipLink');
				replaceInFile(tree, filePath, /jumpLinks/g, 'skipLinks');
			};
			return applyInTree(tree, apply, '*.{ts,html}');
		});
	}

	private useKebabCaseForMixins(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Rename some mixins to use kebab-case');
			const apply = (filePath: string): void => {
				['ob-gridTemplate', 'ob-gridSpan', 'ob-gridWidth', 'ob-flexBase', 'ob-flexGrow', 'ob-dropShadow', 'ob-innerBottomShadow'].forEach(
					mixin => {
						replaceInFile(tree, filePath, new RegExp(mixin, 'g'), this.toKebabCase(mixin));
					}
				);
			};
			return applyInTree(tree, apply, '*.scss');
		});
	}

	private renameOpened(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Rename getOpened to opened$');
			const apply = (filePath: string): void => {
				const fileContent = readFile(tree, filePath);
				const offCanvas = /(?<offCanvas>\w*)\s*:\s*ObOffCanvasService/.exec(fileContent)?.groups?.offCanvas;
				if (offCanvas) {
					replaceInFile(tree, filePath, new RegExp(`${offCanvas}.opened`), `${offCanvas}.opened$`);
				}
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}
}
