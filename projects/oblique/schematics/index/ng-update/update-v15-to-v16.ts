import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {
	applyInTree,
	createSafeRule,
	filePatterns,
	infoMigration,
	readFile,
	removeImport,
	replaceInFile,
	warnIfStandalone,
} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV16Schema {}

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
}
