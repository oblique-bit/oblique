import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, createSafeRule, infoMigration, readFile, removeImport, replaceInFile} from '../utils';
import {removeProperty} from './ng-update-utils';

export interface IUpdateV13Schema {}

export class UpdateV12toV13 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV13Schema): Rule {
		return (tree: Tree, _context: SchematicContext) =>
			chain([this.removeObFormField(), this.migrateMasterLayoutProperties(), this.removeObCheckbox(), this.migrateTableRowCheckedClass()])(
				tree,
				_context
			);
	}

	private removeObFormField(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove form field feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObSelectDirective', '@oblique/oblique');
				removeImport(tree, filePath, 'ObFormFieldDirective', '@oblique/oblique');
				removeImport(tree, filePath, 'ObFormFieldModule', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?:ObFormFieldModule|ObFormFieldDirective|ObSelectDirective)\s*,?\s*/g, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private migrateMasterLayoutProperties(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove deprecated MasterLayoutService configs.');
			const toApply = (filePath: string): void => {
				const fileContent = readFile(tree, filePath);
				let replacement = fileContent;
				replacement = removeProperty(replacement, 'footer', 'hasLogoOnScroll');
				replacement = removeProperty(replacement, 'header', 'reduceOnScroll');
				if (fileContent !== replacement) {
					tree.overwrite(filePath, replacement);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private removeObCheckbox(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove checkbox feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObCheckboxModule', '@oblique/oblique');
				removeImport(tree, filePath, 'ObCheckboxDirective', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?:ObCheckboxModule|ObCheckboxDirective)\s*,?\s*/g, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private migrateTableRowCheckedClass(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrate ob-table-row-checked class');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /(?<=tr|&)\.ob-table-row-checked/g, ':has([checked])');
				replaceInFile(tree, filePath, /\.ob-table-row-checked/g, 'tr:has([checked])');
			};
			return applyInTree(tree, apply, '*.{scss,css}');
		});
	}
}
