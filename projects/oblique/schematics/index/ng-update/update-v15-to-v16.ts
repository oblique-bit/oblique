import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {
	addImport,
	applyInTree,
	createSafeRule,
	filePatterns,
	infoMigration,
	readFile,
	removeImport,
	replaceInFile,
	warn,
	warnIfStandalone,
} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV16Schema {}

const obliquePackage = '@oblique/oblique';
const schemaValidationPackage = '@oblique/oblique/schema-validation';
const schemaValidationImports = [
	'draft07Convert',
	'ObMockSchemaRequiredDirective',
	'ObMockSchemaValidateDirective',
	'ObMockSchemaValidationDirective',
	'ObMockSchemaValidationModule',
	'ObMockSchemaValidationService',
	'ObSchemaRequiredDirective',
	'ObSchemaValidateDirective',
	'ObSchemaValidationDirective',
	'ObSchemaValidationModule',
	'ObSchemaValidationService',
	'ObSchemaValidatorInstance',
];

export function removeObIconModuleReferences(content: string): string {
	const obIconModuleReference = String.raw`ObIconModule(?:\.forRoot\([^)]*\))?`;
	return content
		.replace(new RegExp(String.raw`importProvidersFrom\(\s*${obIconModuleReference}\s*\),?\s*`, 'gmu'), '')
		.replace(new RegExp(String.raw`\[\s*${obIconModuleReference}\s*,?\s*`, 'gmu'), '[')
		.replace(new RegExp(String.raw`,\s*${obIconModuleReference}(?=\s*[,}\]])`, 'gmu'), '')
		.replace(new RegExp(String.raw`,\s*${obIconModuleReference}\s*,?`, 'gmu'), ',');
}

export function removeMasterLayoutConfigLocaleReferences(content: string): string {
	const configReference = String.raw`[\w$]+(?:\.[\w$]+)*`;
	const localeProperty = String.raw`(?:\.[\w$]+|\[['"\x60][^'"\x60]+['"\x60]\])`;
	const assignmentSuffix = String.raw`(?:[^\S\r\n]+(?:as|satisfies)[^\r\n;]+)?;?`;

	return content
		.replace(
			new RegExp(
				String.raw`^\s*${configReference}\.locale\s*=\s*\{[^\n]*\}${assignmentSuffix}[^\S\r\n]*(?:\r?\n)?`,
				'gmu'
			),
			''
		)
		.replace(
			new RegExp(
				String.raw`^\s*${configReference}\.locale\s*=\s*\{[\s\S]*?^\s*\}${assignmentSuffix}[^\S\r\n]*(?:\r?\n)?`,
				'gmu'
			),
			''
		)
		.replace(
			new RegExp(
				String.raw`^\s*${configReference}\.locale${localeProperty}+\s*=\s*[^;\n]+;?[^\S\r\n]*(?:\r?\n)?`,
				'gmu'
			),
			''
		)
		.replace(/^\s*locale\s*:\s*\{[\s\S]*?^\s*\},?\s*/gmu, '')
		.replace(/^\s*locale\s*:\s*\{[^{}\n]*\},?\s*$/gmu, '')
		.replace(/^\s*locale\s*:\s*[^,\n]+,?\s*$/gmu, '');
}

export class UpdateV15toV16 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV16Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([
				warnIfStandalone(),
				this.renameFocusElement(),
				this.removeObIconModule(),
				this.removeMasterLayoutConfigLocales(),
				this.moveSchemaValidationImports(),
				this.warnAboutSchemaValidationOnObliqueModule(),
				this.warnAboutSchemaValidationOnObliqueTestingModule(),
				this.addXhrToHttpClientProvider(),
			])(tree, context);
	}

	private renameFocusElement(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename focusElement() to focusElementById()');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /(?<=masterLayout(?:\(\))?\??\.)focusElement/gmu, 'focusElementById');
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private removeObIconModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObIconModule');
			const toApply = (filePath: string): void => {
				if (!readFile(tree, filePath).includes('ObIconModule')) {
					return;
				}
				removeImport(tree, filePath, 'ObIconModule', '@oblique/oblique');
				tree.overwrite(filePath, removeObIconModuleReferences(readFile(tree, filePath)));
			};
			return applyInTree(tree, toApply, filePatterns.ts);
		});
	}

	private removeMasterLayoutConfigLocales(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObMasterLayoutConfig.locale');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (!content.includes('ObMasterLayoutConfig')) {
					return;
				}
				tree.overwrite(filePath, removeMasterLayoutConfigLocaleReferences(content));
			};
			return applyInTree(tree, toApply, filePatterns.ts);
		});
	}

	private moveSchemaValidationImports(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Move schema validation imports to the secondary entry point');
			const toApply = (filePath: string): void => {
				const fileContent = tree.readText(filePath);
				const updatedContent = this.rewriteSchemaValidationImports(fileContent);
				if (updatedContent !== fileContent) {
					tree.overwrite(filePath, updatedContent);
				}
			};
			return applyInTree(tree, toApply, filePatterns.ts);
		});
	}

	private rewriteSchemaValidationImports(fileContent: string): string {
		const tree = Tree.empty();
		const filePath = '/test.ts';
		tree.create(filePath, fileContent);
		this.moveSchemaValidationImportsInFile(tree, filePath);
		return tree.readText(filePath);
	}

	private moveSchemaValidationImportsInFile(tree: Tree, filePath: string): void {
		schemaValidationImports.forEach(importName => {
			removeImport(tree, filePath, importName, obliquePackage).forEach(removedSpecifier =>
				addImport(tree, filePath, removedSpecifier, schemaValidationPackage)
			);
		});
	}

	private warnAboutSchemaValidationOnObliqueModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			let usesSchemaValidation = false;
			let importsObliqueModule = false;

			applyInTree(
				tree,
				(filePath: string): void => {
					const fileContent = tree.readText(filePath);
					usesSchemaValidation ||=
						/\b(?:obSchemaValidation|obSchemaValidate|ObSchemaValidationModule|ObSchemaValidationService)\b/u.test(
							fileContent
						);
					importsObliqueModule ||= /\bObliqueModule\b/u.test(fileContent);
				},
				filePatterns.tsAndHtml
			);

			if (usesSchemaValidation && importsObliqueModule) {
				warn(
					context,
					'Schema validation is now a secondary entry point and is no longer exported by ObliqueModule. ' +
						"If your application relied on ObliqueModule alone, import ObSchemaValidationModule from '@oblique/oblique/schema-validation' manually."
				);
			}

			return tree;
		});
	}

	private warnAboutSchemaValidationOnObliqueTestingModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			let usesSchemaValidation = false;
			let importsObliqueTestingModule = false;

			applyInTree(
				tree,
				(filePath: string): void => {
					const fileContent = tree.readText(filePath);
					usesSchemaValidation ||=
						/\b(?:obSchemaValidation|obSchemaValidate|ObMockSchemaValidationModule|ObMockSchemaValidationService)\b/u.test(
							fileContent
						);
					importsObliqueTestingModule ||= /\bObliqueTestingModule\b/u.test(fileContent);
				},
				filePatterns.tsAndHtml
			);

			if (usesSchemaValidation && importsObliqueTestingModule) {
				warn(
					context,
					'Schema validation mocks are now part of the secondary entry point. ' +
						"If your tests relied on ObliqueTestingModule alone, import ObMockSchemaValidationModule from '@oblique/oblique/schema-validation' manually."
				);
			}

			return tree;
		});
	}

	private addXhrToHttpClientProvider(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Add withXhr() to provideHttpClient()');
			const toApply = (filePath: string): void => {
				const providerOptions = /(?:provideHttpClient\()(?<options>[^\r\n]*)/u.exec(readFile(tree, filePath))?.groups
					?.options;
				if (providerOptions && !providerOptions.includes('withXhr()')) {
					addImport(tree, filePath, 'withXhr', '@angular/common/http');
					replaceInFile(
						tree,
						filePath,
						`provideHttpClient(${providerOptions}`,
						`provideHttpClient(withXhr(), ${providerOptions}`
					);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}
}
