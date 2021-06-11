import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {applyInTree, infoMigration, replaceInFile} from '../utils';
import {removePolyFill} from './ng-update-utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV7Schema {}

export class UpdateV6toV7 implements ObIMigrations {
	dependencies = {};

	applyMigrations(_options: IUpdateV7Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			return chain([this.adaptPolyfills(), this.renameObIconsConfig()])(tree, _context);
		};
	}

	adaptPolyfills(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Removing IE 11 polyfills');
			removePolyFill(tree, 'web-animations-js', /import\s+['"]web-animations-js['"];/);
			removePolyFill(tree, 'classlist.js', /import\s+['"]classlist.js['"];/);
		};
	}

	private renameObIconsConfig(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming ObIconsConfig into ObIconConfig');
			const toApply = (filePath: string) => {
				replaceInFile(tree, filePath, new RegExp('ObIconsConfig', 'g'), 'ObIconConfig');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private renameSpacingLg(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming $spacing-lg into $spacing-xl');
			const toApply = (filePath: string) => {
				replaceInFile(tree, filePath, new RegExp('\\$spacing-lg', 'g'), '$spacing-xl');
			};
			return applyInTree(tree, toApply, '*.scss');
		};
	}
}
