import {Rule, SchematicContext, Tree, chain, noop} from '@angular-devkit/schematics';
import {
	applyInTree,
	createSafeRule,
	infoMigration,
	readFile,
	removeImport,
	replaceInFile,
	warnIfStandalone,
} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV15Schema {}

export class UpdateV14toV15 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV15Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([warnIfStandalone(), this.removeBrowserAnimationModuleIfUnused()])(tree, context);
	}

	private removeBrowserAnimationModuleIfUnused(): Rule {
		return (tree: Tree): Rule => {
			let useAnimations = false;
			applyInTree(
				tree,
				(filePath: string): void => {
					if (/@Component\s*\(\s*\{.*?animations\s*:.*?\}\)/su.test(readFile(tree, filePath))) {
						useAnimations = true;
					}
				},
				'*.ts'
			);

			return useAnimations ? noop() : this.removeBrowserAnimationsModule();
		};
	}

	private removeBrowserAnimationsModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove BrowserAnimationsModule');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('BrowserAnimationsModule')) {
					removeImport(tree, filePath, 'BrowserAnimationsModule', '@angular/platform-browser/animations');
					replaceInFile(tree, filePath, /BrowserAnimationsModule,?/gu, '');
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}
}
