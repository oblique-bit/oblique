import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, createSafeRule, infoMigration, removeImport, replaceInFile, setAngularProjectsConfig} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV10Schema {}

export class UpdateV10toV11 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV10Schema): Rule {
		return (tree: Tree, _context: SchematicContext) =>
			chain([
				this.removeObSearchBox(),
				this.removeFakeFocus(),
				this.replaceScssWithCssStylesInAngularJson(),
				this.replaceNgContainerToken('obHeaderCustomControl'),
				this.replaceNgContainerToken('obLocales'),
				this.wrapOneLinerContentProjectionWithNgTemplate('obHeaderCustomControl'),
				this.wrapOneLinerContentProjectionWithNgTemplate('obLocales'),
				this.wrapMultiLinerContentProjectionWithNgTemplate('obHeaderCustomControl'),
				this.wrapMultiLinerContentProjectionWithNgTemplate('obLocales'),
				this.removeContentProjectionMarker('obHeaderCustomControl'),
				this.removeContentProjectionMarker('obLocales')
			])(tree, _context);
	}

	private removeObSearchBox(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove search box feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObSearchBoxModule', '@oblique/oblique');
				removeImport(tree, filePath, 'ObSearchBoxComponent', '@oblique/oblique');
				removeImport(tree, filePath, 'ObISearchWidgetItem', '@oblique/oblique');
				replaceInFile(tree, filePath, /ObSearchBoxModule\s*,?\s*/, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private removeFakeFocus(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove fake focus');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObNavTreeFakeFocusDirective', '@oblique/oblique');
				replaceInFile(tree, filePath, /\[?obNavTreeFakeFocus]?\s*=\s*["'].*?["']\s*/g, '');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private replaceScssWithCssStylesInAngularJson(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Replace scss with css styles in angular.json');
			return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: string[]) => {
				const styles = ['oblique-core', 'oblique-alert', 'oblique-icons'];
				styles.forEach(style => {
					const index = config.indexOf(`node_modules/@oblique/oblique/styles/scss/${style}.scss`);
					if (index !== -1) {
						config[index] = `node_modules/@oblique/oblique/styles/css/${style}.css`;
					}
				});
				return config;
			});
		});
	}

	private replaceNgContainerToken(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Replace ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`<ng-container[^>]*?${token}.*?>(?<content>.*?)<\\/ng-container>`, 'gs'),
					'<ng-template #obHeaderControl>$<content></ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private wrapOneLinerContentProjectionWithNgTemplate(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Wrap one liner ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`(?<content><(?<tag>[\\w-]+).*?${token}.*?>.*?<\\/\\k<tag>>)`, 'g'),
					'<ng-template #obHeaderControl>$<content></ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private wrapMultiLinerContentProjectionWithNgTemplate(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Wrap ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`(?<content>(?<whitespace>[\t ]*)<(?<tag>[\\w-]+)[^<]*?${token}.*?>.*?^\\k<whitespace><\\/\\k<tag>>)`, 'gsm'),
					'<ng-template #obHeaderControl>\n$<content>\n</ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private removeContentProjectionMarker(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Remove ${token} content projection marker`);
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, new RegExp(`\\s*${token}`, 'g'), '');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}
}
