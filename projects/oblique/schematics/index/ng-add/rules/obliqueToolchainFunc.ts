import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {getFileContent} from '@schematics/angular/utility/test';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {addImportToModule, insertImport} from '@schematics/angular/utility/ast-utils';
import {addFile, angularJsonConfigPath, applyChanges, appModulePath, OBLIQUE_PACKAGE, obliqueCssPath} from '../../ng-add-utils';
import * as fs from 'fs';
import * as ts from 'typescript';

export function updateAssets(json: any, defaultProjectName: string, path: string, optionsJson: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!optionsJson.styles.includes(obliqueCssPath)) {
			optionsJson.styles.unshift(obliqueCssPath);
			optionsJson.assets.push({
				glob: '**/*',
				input: 'node_modules/@oblique/oblique/styles',
				output: '/assets/styles'
			});
		}
		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

export function addMainCSS(json: any, defaultProjectName: string, path: string, optionsJson: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		json.projects[defaultProjectName].architect.build.options = optionsJson;
		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

export function addTranslationFiles(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const path = 'src/assets/i18n/';
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, {recursive: true});
		}
		langs.forEach((lang: string) => addFile(tree, `${path}${lang}.json`, '{}'));

		return tree;
	};
}

export function addTranslationToImports(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const translateModuleName = ' TranslateModule ';
		const translateSource = '@ngx-translate/core';
		const translateModuleImport = 'TranslateModule.forRoot(multiTranslateLoader())';
		const appModule = getFileContent(tree, appModulePath);
		const sourceFileText: any = tree.read(appModulePath);
		const sourceFile = ts.createSourceFile(appModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
		const changes: Change[] = [];

		if (!appModule.split('@NgModule')[1].includes(translateModuleName)) {
			addImportToModule(sourceFile, appModulePath, translateModuleImport, translateSource).forEach((change: Change) => changes.push(change));
			if (changes.length > 1) {
				(changes[1] as InsertChange).toAdd = `; \nimport {${translateModuleName}} from '${translateSource}'`;
			}
		}

		changes.push(insertImport(sourceFile, appModulePath, 'multiTranslateLoader', OBLIQUE_PACKAGE));
		tree = applyChanges(tree, appModulePath, changes);

		return tree;
	};
}
