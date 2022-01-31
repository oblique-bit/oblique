import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {insertImport} from '@angular/cdk/schematics';
import {addImportToModule, addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {adaptInsertChange, addDependency, appModulePath, applyChanges, createSrcFile, importModuleInRoot} from '../ng-add-utils';
import {ObliquePackage, addFile, infoMigration, readFile} from '../../utils';

export function addLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([importLocales(locales), registerLocales(locales), configureLocales(locales), addTranslation(locales)])(tree, _context);
}

function importLocales(locales: string[]): Rule {
	return (tree: Tree, _context: SchematicContext): Tree => {
		infoMigration(_context, 'Oblique: Adding locale management & translations');
		const sourceFile = createSrcFile(tree, appModulePath);
		const file = 'app.module.ts';
		const changes = [
			...addProviderToModule(sourceFile, appModulePath, `{provide: LOCALE_ID, useValue: '${locales[0]}'}`, 'TEMP'),
			insertImport(sourceFile, file, 'registerLocaleData', '@angular/common'),
			insertImport(sourceFile, file, 'LOCALE_ID', '@angular/core')
		]
			.filter((change: Change) => change instanceof InsertChange)
			.filter((change: InsertChange) => !change.toAdd.includes('TEMP'));

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
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
	return !new RegExp(`registerLocaleData\\(${getLocaleVariable(locale)}\\)`, 'i').exec(readFile(tree, appModulePath));
}
