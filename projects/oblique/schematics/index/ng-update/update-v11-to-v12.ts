import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {
	applyInTree,
	checkForSSR,
	checkForStandalone,
	createSafeRule,
	infoMigration,
	readFile,
	removeInjectionInClass,
	removeServiceMethodCall
} from '../utils';

export interface IUpdateV11Schema {}

export class UpdateV11toV12 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV11Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([checkForStandalone(), checkForSSR(), this.removeObLanguageService()])(tree, context);
	}

	private removeObLanguageService(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObLanguageService');
			const apply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('ObLanguageService')) {
					removeInjectionInClass(tree, filePath, 'ObLanguageService', '@oblique/oblique');
					removeServiceMethodCall(tree, filePath, 'setLocaleOnAdapter');
				}
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}
}
