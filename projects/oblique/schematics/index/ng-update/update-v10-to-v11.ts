import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, createSafeRule, infoMigration, removeImport, replaceInFile} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV10Schema {}

export class UpdateV10toV11 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV10Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => chain([this.removeObSearchBox()])(tree, _context);
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
}
