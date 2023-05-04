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
			chain([this.removeObSearchBox(), this.removeFakeFocus(), this.replaceScssWithCssStylesInAngularJson()])(tree, _context);
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
}
