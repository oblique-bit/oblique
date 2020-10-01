import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {bold, colors} from '@angular-devkit/core/src/terminal';
import {getFileContent} from '@schematics/angular/utility/test';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {
	angularJsonConfigPath,
	applyChanges,
	appModulePath,
	createDependency,
	getJson,
	getJsonProperty,
	importModule,
	isAngular10,
	OBLIQUE_PACKAGE,
	obliqueCssPath
} from '../../ng-add-utils';
import {addLocales} from './locales';
import * as ts from 'typescript';
import yellow = colors.yellow;

export function oblique(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addFavIcon(),
			importModule('ObMasterLayoutModule', OBLIQUE_PACKAGE),
			importModule('BrowserAnimationsModule', '@angular/platform-browser/animations'),
			embedMasterLayout(options.title),
			addComment(),
			addThemeDependencies(options.theme),
			addThemeCSS(options.theme),
			addFontWarning(options.font),
			addFontInjectionToken(options.font.toUpperCase() || 'NONE'),
			addLocales(options.langs.split(' '))
		])(tree, _context);
}

function addFavIcon(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		const index = getJsonProperty(json, `projects;${defaultProjectName};architect;build;options;index`);

		if (tree.exists(index)) {
			tree.overwrite(
				index,
				getFileContent(tree, index).replace(
					'<link rel="icon" type="image/x-icon" href="favicon.ico">',
					'<link href="assets/styles/images/favicon.png" rel="shortcut icon"/>'
				)
			);
		}
		return tree;
	};
}

function embedMasterLayout(title: string): Rule {
	const filePath = 'node_modules/@oblique/oblique/schematics/index/ng-add/templates/default-master-layout.html';
	const path = 'src/app/app.component.html';

	return (tree: Tree, _context: SchematicContext) => {
		if (tree.exists(path)) {
			const layoutContent = getFileContent(tree, filePath);
			const masterLayoutContent = layoutContent.replace(/_APP_TITLE_PLACEHOLDER_/, title);
			tree.overwrite(path, masterLayoutContent);
		}
		return tree;
	};
}

function addComment(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const appModuleContent = getFileContent(tree, appModulePath);
		tree.overwrite(appModulePath, appModuleContent.replace(/ObMasterLayoutModule,\n/g, 'ObMasterLayoutModule, // add other Oblique modules as needed\n'));
		return tree;
	};
}

function addThemeDependencies(theme: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const angular10 = isAngular10(tree);
		if (theme === 'material') {
			addPackageJsonDependency(tree, createDependency('@angular/cdk', angular10));
			addPackageJsonDependency(tree, createDependency('@angular/material', angular10));
		} else {
			addPackageJsonDependency(tree, createDependency('@ng-bootstrap/ng-bootstrap', angular10));
		}

		return tree;
	};
}

function addThemeCSS(theme: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!tree.exists(angularJsonConfigPath)) {
			return tree;
		}

		const styleSheet = `node_modules/@oblique/oblique/styles/css/oblique-${theme}.css`;
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		const optionsJson: any = getJsonProperty(json, `projects;${defaultProjectName};architect;build;options`);

		if (!optionsJson.styles.includes(styleSheet)) {
			const index = optionsJson.styles.indexOf(obliqueCssPath);
			optionsJson.styles.splice(index, 0, styleSheet);
		}

		json.projects[defaultProjectName].architect.build.options = optionsJson;
		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function addFontWarning(font: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		/* eslint-disable max-len */
		const text =
			font === 'frutiger'
				? '\nDue to licence restrictions, Frutiger font files cannot be delivered with Oblique. \nThey can either be obtained from the federal chancellery intranet\n(https://intranet.bk.admin.ch/bk-intra/de/home/dl-koordination-bund/kommunikation/webforum-bund/Downloads.html) or requested from webforum@bk.admin.ch. Moreover, each project is responsible for the font protection according to its licence. (https://github.com/swiss/styleguide/blob/master/src/assets/fonts/LICENSE). The proposed solution consist of only delivering the font if the Referer Http header is whitelisted.\n'
				: '\nWarning: Furtiger is mandatory for CI/CD conformity';
		/* eslint-enable max-len */
		_context.logger.info(bold(yellow(text)));
		return tree;
	};
}

function addFontInjectionToken(font: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const providerToAdd = `{ provide: OBLIQUE_FONT, useValue: FONTS.${font} }`;
		const sourceFileText: any = tree.read(appModulePath);
		const sourceFile = ts.createSourceFile(appModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
		const changes: Change[] = addProviderToModule(sourceFile, appModulePath, providerToAdd, OBLIQUE_PACKAGE);
		if (changes.length > 1) {
			(changes[1] as InsertChange).toAdd = (changes[1] as InsertChange).toAdd.replace('{ provide: OBLIQUE_FONT, useValue: FONTS', 'OBLIQUE_FONT, FONTS');
		}
		tree = applyChanges(tree, appModulePath, changes);

		return tree;
	};
}
