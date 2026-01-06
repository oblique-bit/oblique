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
			chain([warnIfStandalone(), this.renameIcons(), this.removeBrowserAnimationModuleIfUnused()])(tree, context);
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
	private renameIcons(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename icons');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /svgIcon="arrow_down-left"/g, 'svgIcon="arrow_down_left"');
				replaceInFile(tree, filePath, /ObEIcon\.ARROW_DOWN-LEFT/g, 'ObEIcon.ARROW_DOWN_LEFT');
				replaceInFile(tree, filePath, /svgIcon="arrow_down-right"/g, 'svgIcon="arrow_down_right"');
				replaceInFile(tree, filePath, /ObEIcon\.ARROW_DOWN-RIGHT/g, 'ObEIcon.ARROW_DOWN_RIGHT');
				replaceInFile(tree, filePath, /svgIcon="arrow_up-left"/g, 'svgIcon="arrow_up_left"');
				replaceInFile(tree, filePath, /ObEIcon\.ARROW_UP-LEFT/g, 'ObEIcon.ARROW_UP_LEFT');
				replaceInFile(tree, filePath, /svgIcon="arrow_up-right"/g, 'svgIcon="arrow_up_right"');
				replaceInFile(tree, filePath, /ObEIcon\.ARROW_UP-RIGHT/g, 'ObEIcon.ARROW_UP_RIGHT');
				replaceInFile(tree, filePath, /svgIcon="chevron_left-small"/g, 'svgIcon="chevron_left_small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_LEFT-SMALL/g, 'ObEIcon.CHEVRON_LEFT_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron_double-left"/g, 'svgIcon="chevron_left_double"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_DOUBLE-LEFT/g, 'ObEIcon.CHEVRON_DOUBLE_LEFT');
				replaceInFile(tree, filePath, /svgIcon="chevron_right-small"/g, 'svgIcon="chevron_right_small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_RIGHT-SMALL/g, 'ObEIcon.CHEVRON_RIGHT_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron_double-right"/g, 'svgIcon="chevron_right_double"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_DOUBLE-RIGHT/g, 'ObEIcon.CHEVRON_DOUBLE_RIGHT');
				replaceInFile(tree, filePath, /svgIcon="chevron_down-small"/g, 'svgIcon="chevron_down_small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_DOWN-SMALL/g, 'ObEIcon.CHEVRON_DOWN_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron_up-small"/g, 'svgIcon="chevron_up_small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_UP-SMALL/g, 'ObEIcon.ACHEVRON_UP_SMALL');
				replaceInFile(tree, filePath, /svgIcon="sort-list_descending"/g, 'svgIcon="sort_list_descending"');
				replaceInFile(tree, filePath, /ObEIcon\.SORT-LIST_DESCENDING/g, 'ObEIcon.SORT_LIST_DESCENDING');
				replaceInFile(tree, filePath, /svgIcon="sort-list_ascending"/g, 'svgIcon="sort_list_ascending"');
				replaceInFile(tree, filePath, /ObEIcon\.SORT-LIST_ASCENDING/g, 'ObEIcon.SORT_LIST_ASCENDING');
			};
			return applyInTree(tree, toApply, '*.{ts,html}');
		});
	}
}
