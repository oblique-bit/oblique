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

export class UpdateV15toV16 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV16Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([warnIfStandalone(), this.renameFocusElement(), this.removeObIconModule()])(tree, context);
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
}
