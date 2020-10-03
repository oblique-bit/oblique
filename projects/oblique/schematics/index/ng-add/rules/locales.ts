import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {insertImport} from '@angular/cdk/schematics';
import {getFileContent} from '@schematics/angular/utility/test';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange} from '@schematics/angular/utility/change';
import {applyChanges, appModulePath, OBLIQUE_PACKAGE} from '../../ng-add-utils';
import * as ts from 'typescript';

export function addLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => chain([importLocales(langs), registerLocales(langs), configureLocales(langs)])(tree, _context);
}

function importLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const appModuleContent = getFileContent(tree, appModulePath);
		const sourceFile = ts.createSourceFile(appModulePath, appModuleContent, ts.ScriptTarget.Latest, true);
		const file = 'app.module.ts';
		const locales = langToLocale(langs);
		const changes = [
			...addProviderToModule(sourceFile, appModulePath, `{provide: LOCALE_ID, useValue: '${locales[0].locale}'}`, 'TEMP'),
			insertImport(sourceFile, file, 'registerLocaleData', '@angular/common'),
			insertImport(sourceFile, file, 'LOCALE_ID', '@angular/core')
		].filter(change => (change as InsertChange).toAdd.indexOf('TEMP') === -1);
		locales
			.map(locale => insertImport(sourceFile, file, locale.variable, `@angular/common/locales/${locale.locale}`))
			.forEach(change => {
				(change as InsertChange).toAdd = (change as InsertChange).toAdd.replace('{', '').replace('}', '');
				changes.push(change);
			});

		tree = applyChanges(tree, appModulePath, changes);
		return tree;
	};
}

function registerLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const locales = langToLocale(langs);
		const replacement = locales
			.map(locale => `registerLocaleData(${locale.variable});`)
			.reduce((rep, locale) => [...rep, locale], [])
			.concat('\n@NgModule')
			.join('\n');
		let appModuleContent = getFileContent(tree, appModulePath);

		tree.overwrite(appModulePath, appModuleContent.replace(/@NgModule/, replacement));
		return tree;
	};
}

function configureLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (langs.join('_') !== ['de', 'fr', 'it'].join('_')) {
			const appModuleContent = getFileContent(tree, appModulePath);
			tree.overwrite(
				appModulePath,
				appModuleContent.replace(
					'AppModule { }',
					`AppModule { 
	constructor(config: ObMasterLayoutConfig) {
		config.locale.locales = ['${langs.join("', '")}'];
	}
}`
				)
			);

			const sourceFile = ts.createSourceFile(appModulePath, appModuleContent, ts.ScriptTarget.Latest, true);
			const file = 'app.module.ts';
			const changes = [insertImport(sourceFile, file, 'ObMasterLayoutConfig', OBLIQUE_PACKAGE)];
			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function langToLocale(langs: string[]): {locale: string; variable: string}[] {
	return langs.map(lang => {
		if (['de', 'fr', 'it', 'en'].includes(lang.toLowerCase())) {
			return {
				locale: `${lang.toLowerCase()}-CH`,
				variable: `locale${lang.toUpperCase()}CH`
			};
		} else {
			return {
				locale: lang.toLowerCase(),
				variable: `locale${lang.toUpperCase()}`
			};
		}
	});
}
