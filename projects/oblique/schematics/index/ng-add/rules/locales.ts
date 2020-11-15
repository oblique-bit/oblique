import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {insertImport} from '@angular/cdk/schematics';
import {addImportToModule, addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {applyChanges, appModulePath, createSrcFile, addDevDependency, importModule, adaptInsertChange} from '../ng-add-utils';
import {addFile, infoMigration, ObliquePackage, readFile} from '../../utils';

export function addLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([importLocales(langs), registerLocales(langs), configureLocales(langs), addTranslation(langs)])(tree, _context);
}

function importLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding locale management & translations');
		const sourceFile = createSrcFile(tree, appModulePath);
		const file = 'app.module.ts';
		const locales = langToLocale(langs);
		const changes = [
			...addProviderToModule(sourceFile, appModulePath, `{provide: LOCALE_ID, useValue: '${locales[0].locale}'}`, 'TEMP'),
			insertImport(sourceFile, file, 'registerLocaleData', '@angular/common'),
			insertImport(sourceFile, file, 'LOCALE_ID', '@angular/core')
		]
			.filter((change: Change) => change instanceof InsertChange)
			.filter((change: InsertChange) => change.toAdd.indexOf('TEMP') === -1);

		locales
			.filter(locale => filterLocale(tree, locale))
			.map(locale => insertImport(sourceFile, file, locale.variable, `@angular/common/locales/${locale.locale}`))
			.filter((change: Change) => change instanceof InsertChange)
			.map((change: InsertChange) => adaptInsertChange(tree, change, /(?:{\s*)|(?:\s*})/g, ''))
			.forEach((change: InsertChange) => changes.push(change));
		return applyChanges(tree, appModulePath, changes);
	};
}

function registerLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const locales = langToLocale(langs);
		const replacement = locales
			.filter(locale => filterLocale(tree, locale))
			.map(locale => `registerLocaleData(${locale.variable});`)
			.reduce((rep, locale) => [...rep, locale], [])
			.concat('\n@NgModule')
			.join('\n');
		tree.overwrite(appModulePath, readFile(tree, appModulePath).replace('@NgModule', replacement));
		return tree;
	};
}

function configureLocales(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (langs.join('_') !== ['de', 'fr', 'it'].join('_')) {
			const appModuleContent = readFile(tree, appModulePath).replace(
				'AppModule { }',
				`AppModule {
	constructor(config: ObMasterLayoutConfig) {
		config.locale.locales = ['${langs.join("', '")}'];
	}
}`
			);
			tree.overwrite(appModulePath, appModuleContent);

			const sourceFile = createSrcFile(tree, appModulePath);
			const changes = [insertImport(sourceFile, 'app.module.ts', 'ObMasterLayoutConfig', ObliquePackage)];
			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function addTranslation(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		addDevDependency(tree, '@ngx-translate/core');
		langs.forEach((lang: string) => addFile(tree, `src/assets/i18n/${lang}.json`, '{}'));
		addTranslationToImports(tree);
		return chain([importModule('HttpClientModule', '@angular/common/http')])(tree, _context);
	};
}

function addTranslationToImports(tree: Tree): Tree {
	const translateSource = '@ngx-translate/core';
	const translateModuleImport = 'TranslateModule.forRoot(multiTranslateLoader())';
	const sourceFile = createSrcFile(tree, appModulePath);
	const changes = addImportToModule(sourceFile, appModulePath, translateModuleImport, translateSource)
		.concat(insertImport(sourceFile, appModulePath, 'multiTranslateLoader', ObliquePackage))
		.filter((change: Change) => change instanceof InsertChange);

	return applyChanges(tree, appModulePath, changes);
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

function filterLocale(tree: Tree, locale: {locale: string; variable: string}): boolean {
	return !readFile(tree, appModulePath).match(new RegExp(`registerLocaleData\\(${locale.variable}\\)`, 'i'));
}
