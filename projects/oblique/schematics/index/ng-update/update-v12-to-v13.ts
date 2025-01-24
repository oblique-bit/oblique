import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {addImport, applyInTree, createSafeRule, infoMigration, readFile, removeImport, replaceInFile} from '../utils';
import {removeProperty} from './ng-update-utils';

export interface IUpdateV13Schema {}

export class UpdateV12toV13 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV13Schema): Rule {
		return (tree: Tree, _context: SchematicContext) =>
			chain([
				this.removeObFormField(),
				this.migrateMasterLayoutProperties(),
				this.removeObCheckbox(),
				this.migrateTableRowCheckedClass(),
				this.addObliqueProviders(),
				this.migrateObMaterialConfig()
			])(tree, _context);
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

	private addObliqueProviders(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Add Oblique providers');
			const apply = (filePath: string): void => {
				addImport(tree, filePath, 'provideObliqueConfiguration', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?<=providers\s*:\s*\[\s+)(?=[{\w])/, 'provideObliqueConfiguration(),\n');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private migrateObMaterialConfig(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrate OB_MATERIAL_CONFIG');
			const apply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				removeImport(tree, filePath, 'OB_MATERIAL_CONFIG', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?<=provideObliqueConfiguration\()(?=\))/, this.getMaterialConfiguration(content));
				replaceInFile(tree, filePath, /\s*{\s*provide\s*:\s*OB_MATERIAL_CONFIG\s*,\s*useValue\s*:\s*\{.*?}\s*}\s*}.?/s, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private getMaterialConfiguration(content: string): string {
		const materialConfiguration = [
			'MAT_FORM_FIELD_DEFAULT_OPTIONS',
			'STEPPER_GLOBAL_OPTIONS',
			'MAT_CHECKBOX_OPTIONS',
			'MAT_RADIO_OPTIONS',
			'MAT_SLIDE_TOGGLE_OPTIONS',
			'MAT_TABS_CONFIG'
		]
			.map(token => ({token, result: new RegExp(`(?<=${token}:\\s*).*(?=,)`).exec(content)}))
			.filter(({result}) => !!result)
			.map(({token, result}) => `${token}: ${result?.[0]}`)
			.join(',');
		return materialConfiguration.length ? `{material: {${materialConfiguration}}}` : '';
	}
}
