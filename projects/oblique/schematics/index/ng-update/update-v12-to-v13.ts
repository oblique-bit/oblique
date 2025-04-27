import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {
	addImport,
	applyInTree,
	createSafeRule,
	getAngularConfigs,
	infoMigration,
	readFile,
	removeImport,
	replaceInFile,
	setAngularConfig,
	warnIfStandalone
} from '../utils';

export interface IUpdateV13Schema {}

export class UpdateV12toV13 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV13Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([
				this.removeObFormField(),
				this.removeObPaginatorDirective(),
				this.migrateMasterLayoutProperties(),
				this.removeObCheckbox(),
				this.migrateTableRowCheckedClass(),
				this.addObliqueProviders(),
				this.migrateCustomConfig(),
				this.removeObMaterialConfig(),
				this.removeIconModule(),
				this.removeMultiTranslateLoader(),
				this.removeTranslationFiles(),
				this.removeOldFontReferences(),
				this.removeOBShowExternalLinkIconClass(),
				warnIfStandalone()
			])(tree, context);
	}

	private removeObFormField(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove form field feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObSelectDirective', '@oblique/oblique');
				removeImport(tree, filePath, 'ObFormFieldDirective', '@oblique/oblique');
				removeImport(tree, filePath, 'ObFormFieldModule', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?:ObFormFieldModule|ObFormFieldDirective|ObSelectDirective)\s*,?\s*/g, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private removeObPaginatorDirective(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObPaginatorDirective');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObPaginatorDirective', '@oblique/oblique');
				replaceInFile(tree, filePath, /ObPaginatorDirective\s*,?\s*/g, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private migrateMasterLayoutProperties(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove deprecated MasterLayoutService configs.');
			const toApply = (filePath: string): void => {
				const fileContent = readFile(tree, filePath);
				const replacement = fileContent.replace(/^.*footer\.hasLogoOnScroll.*$/gm, '').replace(/^.*header\.reduceOnScroll.*$/gm, '');
				if (fileContent !== replacement) {
					tree.overwrite(filePath, replacement);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private removeObCheckbox(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove checkbox feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObCheckboxModule', '@oblique/oblique');
				removeImport(tree, filePath, 'ObCheckboxDirective', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?:ObCheckboxModule|ObCheckboxDirective)\s*,?\s*/g, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private migrateTableRowCheckedClass(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate ob-table-row-checked class');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /(?<=tr|&)\.ob-table-row-checked/g, ':has([checked])');
				replaceInFile(tree, filePath, /\.ob-table-row-checked/g, 'tr:has([checked])');
			};
			return applyInTree(tree, apply, '*.{scss,css}');
		});
	}

	private addObliqueProviders(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Add Oblique providers');
			const apply = (filePath: string): void => {
				addImport(tree, filePath, 'provideObliqueConfiguration', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?<=providers\s*:\s*)\[/, '[provideObliqueConfiguration(),\n');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private migrateCustomConfig(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate OB_MATERIAL_CONFIG, ObIconModule.forRoot and multiTranslateLoader');
			const apply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				const configs = [
					`accessibilityStatement: {applicationName: "Replace me with the application's name", applicationOperator: 'Replace me with the name and address of the federal office that exploit this application, HTML is permitted', contact: {/* at least 1 email or phone number has to be provided */ emails: [''], phones: ['']}}`,
					this.getMaterialConfiguration(content),
					this.getIconConfiguration(content),
					this.getTranslateConfiguration(content)
				].join(',');
				replaceInFile(tree, filePath, /(?<=provideObliqueConfiguration\()(?=\))/, `{${configs}}`);
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private getMaterialConfiguration(content: string): string {
		const materialConfiguration = [
			'MAT_FORM_FIELD_DEFAULToptions',
			'STEPPER_GLOBALoptions',
			'MAT_CHECKBOXoptions',
			'MAT_RADIOoptions',
			'MAT_SLIDE_TOGGLEoptions',
			'MAT_TABS_CONFIG'
		]
			.map(token => ({token, result: new RegExp(`(?<=${token}:\\s*){[^}]*}`).exec(content)}))
			.filter(({result}) => !!result)
			.map(({token, result}) => `${token}: ${result?.[0]}`)
			.join(',');
		return materialConfiguration.length ? `material: {${materialConfiguration}}` : '';
	}

	private getIconConfiguration(content: string): string {
		const iconConfig = /(?<=ObIconModule\.forRoot\s*\(\s*).*?(?=\))/s.exec(content) ?? [];
		return iconConfig[0]?.length ? `icon: ${iconConfig[0]}` : '';
	}

	private getTranslateConfiguration(content: string): string {
		const translateConfig = /(?<=TranslateModule\.forRoot\s*\(\s*multiTranslateLoader\().*?(?=\)+)/s.exec(content) ?? [];
		const translateFiles = /(?<={\s*provide\s*:\s*TRANSLATION_FILES\s*,\s*useValue\s*:\s*).*?(?=})/s.exec(content) ?? [];
		const config = [];
		if (translateConfig[0]?.length) {
			config.push(`config: ${translateConfig[0]}`);
		}
		if (translateFiles[0]?.length) {
			config.push(`additionalFiles: ${translateFiles[0]}`);
		}
		return config.length ? `translate: {${config.join(',')}}` : '';
	}

	private removeObMaterialConfig(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove OB_MATERIAL_CONFIG');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'OB_MATERIAL_CONFIG', '@oblique/oblique');
				replaceInFile(tree, filePath, /\s*{\s*provide\s*:\s*OB_MATERIAL_CONFIG\s*,\s*useValue\s*:\s*\{.*?}\s*}\s*}.?/s, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private removeIconModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObIconModule.forRoot');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObIconModule', '@oblique/oblique');
				replaceInFile(tree, filePath, /ObIconModule\.forRoot\s*\(.*?\),?\s*/s, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private removeMultiTranslateLoader(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove multiTranslateLoader');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'multiTranslateLoader', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?<=TranslateModule)\.forRoot\s*\(.*?\)+/s, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private removeTranslationFiles(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove TRANSLATION_FILES');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'TRANSLATION_FILES', '@oblique/oblique');
				replaceInFile(tree, filePath, /\s*{\s*provide\s*:\s*TRANSLATION_FILES\s*,\s*useValue\s*:.*},?/s, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private removeOldFontReferences(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove Roboto and Frutiger fonts references');
			getAngularConfigs(tree, ['architect', 'build', 'options', 'styles']).forEach(project => {
				setAngularConfig(tree, ['architect', 'build', 'options', 'styles'], {
					project: project.project,
					config: project.config.filter((style: string) => !(style.endsWith('roboto.css') || style.endsWith('frutiger.css')))
				});
			});
			return tree;
		});
	}

	private removeOBShowExternalLinkIconClass(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove "ob-show-external-link-icon" class');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /ob-show-external-link-icon/g, '');
				replaceInFile(tree, filePath, /class="" ?/g, '');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}
}
