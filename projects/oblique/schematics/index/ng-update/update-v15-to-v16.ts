import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {applyInTree, createSafeRule, infoMigration, replaceInFile, warnIfStandalone} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV16Schema {}

export class UpdateV15toV16 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV16Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([warnIfStandalone(), this.renameFocusElement()])(tree, context);
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
}
