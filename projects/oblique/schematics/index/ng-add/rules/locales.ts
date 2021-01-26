import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {insertImport} from '@angular/cdk/schematics';
import {addImportToModule, addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {applyChanges, appModulePath, createSrcFile, importModuleInRoot, adaptInsertChange, addDependency} from '../ng-add-utils';
import {addFile, infoMigration, ObliquePackage, readFile} from '../../utils';

export function addLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([importLocales(locales), registerLocales(locales), configureLocales(locales), addTranslation(locales)])(tree, _context);
}

function importLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding locale management & translations');
		const sourceFile = createSrcFile(tree, appModulePath);
		const file = 'app.module.ts';
		const changes = [
			...addProviderToModule(sourceFile, appModulePath, `{provide: LOCALE_ID, useValue: '${locales[0]}'}`, 'TEMP'),
			insertImport(sourceFile, file, 'registerLocaleData', '@angular/common'),
			insertImport(sourceFile, file, 'LOCALE_ID', '@angular/core')
		]
			.filter((change: Change) => change instanceof InsertChange)
			.filter((change: InsertChange) => change.toAdd.indexOf('TEMP') === -1);

		locales
			.filter(locale => filterLocale(tree, locale))
			.map(locale => insertImport(sourceFile, file, getLocaleVariable(locale), `@angular/common/locales/${locale}`))
			.filter((change: Change) => change instanceof InsertChange)
			.map((change: InsertChange) => adaptInsertChange(tree, change, /(?:{\s*)|(?:\s*})/g, ''))
			.forEach((change: InsertChange) => changes.push(change));
		return applyChanges(tree, appModulePath, changes);
	};
}

function registerLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const replacement = locales
			.filter(locale => filterLocale(tree, locale))
			.map(locale => `registerLocaleData(${getLocaleVariable(locale)});`)
			.reduce((rep, locale) => [...rep, locale], [])
			.concat('\n@NgModule')
			.join('\n');
		tree.overwrite(appModulePath, readFile(tree, appModulePath).replace('@NgModule', replacement));
		return tree;
	};
}

function configureLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (locales.join('_') !== ['de-CH', 'fr-CH', 'it-CH'].join('_')) {
			const appModuleContent = readFile(tree, appModulePath).replace(
				'AppModule { }',
				`AppModule {
	constructor(config: ObMasterLayoutConfig) {
		config.locale.locales = ['${locales.join("', '")}'];
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

function addTranslation(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		addDependency(tree, '@ngx-translate/core');
		importModuleInRoot(tree, 'HttpClientModule', '@angular/common/http');
		locales.map(locale => locale.split('-')[0]).forEach((lang: string) => addFile(tree, `src/assets/i18n/${lang}.json`, '{}'));
		addTranslationToImports(tree);
		return tree;
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

function getLocaleVariable(locale: string): string {
	return `locale${locale.replace('-', '').toUpperCase()}`;
}

function filterLocale(tree: Tree, locale: string): boolean {
	return !readFile(tree, appModulePath).match(new RegExp(`registerLocaleData\\(${getLocaleVariable(locale)}\\)`, 'i'));
}
