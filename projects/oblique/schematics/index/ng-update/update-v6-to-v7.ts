/* eslint-disable prefer-named-capture-group */
import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {applyInTree, infoMigration, replaceInFile} from '../utils';
import {removePolyFill} from './ng-update-utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV7Schema {}

export class UpdateV6toV7 implements ObIMigrations {
	dependencies = {
		ajv: 8,
		'ajv-formats': 2
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV7Schema): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Analyzing project');
			return chain([
				this.adaptPolyfills(),
				this.renameObIconsConfig(),
				this.renameSpacingLg(),
				this.renameTableTitleAttribute(),
				this.removeDirection(),
				this.migrateAlerts(),
				this.migrateNavigationPathMatch()
			])(tree, context);
		};
	}

	private adaptPolyfills(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Removing IE 11 polyfills');
			removePolyFill(tree, 'web-animations-js', /^\s*import\s+['"]web-animations-js['"];.*/gm);
			removePolyFill(tree, 'classlist.js', /^\s*import\s+['"]classlist.js['"];.*/gm);
		};
	}

	private renameObIconsConfig(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Renaming ObIconsConfig into ObIconConfig');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /ObIconsConfig/g, 'ObIconConfig');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private renameSpacingLg(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Renaming $spacing-lg into $spacing-xl');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /\$spacing-lg/g, '$spacing-xl');
			};
			return applyInTree(tree, toApply, '*.scss');
		};
	}

	private renameTableTitleAttribute(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Renaming title attribute into data-title for tables');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /(?<=<table[^>]*?class=".*?ob-table-collapse.*?".*?<td[^>]*?)(?<!data-)title="/gs, 'data-title="');
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private removeDirection(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Removing direction input on collapse');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /(<ob-collapse\s.*?)\[?direction]?=".*?"\s?(.*?>)/g, '$1$2');
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateAlerts(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Use ob-alert instead of alert classes');
			const toApply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					/<div class="ob-alert ob-alert-(?<type>[a-z]+)"(?: role="alert")?>(?<content>.*?)<\/div>/gs,
					'<ob-alert type="$1">$2</ob-alert>'
				);
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateNavigationPathMatch(): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate pathMatch to routerLinkActiveOptions');
			const toApply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					/(?:(?<={.*(url|label).*)|(?=.*(url|label).*}))pathMatch\s*:\s*['"]full['"]/g,
					"routerLinkActiveOptions: {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}"
				);
				replaceInFile(
					tree,
					filePath,
					/(?:(?<={.*(url|label).*)|(?=.*(url|label).*}))pathMatch\s*:\s*['"]prefix['"]/g,
					"routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}"
				);
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}
}
