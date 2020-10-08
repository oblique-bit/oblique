import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {insertImport} from '@angular/cdk/schematics';
import {addImportToModule, addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {applyChanges, appModulePath, OBLIQUE_PACKAGE, createSrcFile, addDevDependency, addFile, importModule} from '../../ng-add-utils';
import {infoMigration, readFile} from '../../ng-utils';

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
		].filter(change => (change as InsertChange).toAdd.indexOf('TEMP') === -1);
		locales
			.map(locale => insertImport(sourceFile, file, locale.variable, `@angular/common/locales/${locale.locale}`))
			.forEach(change => {
				(change as InsertChange).toAdd = (change as InsertChange).toAdd.replace('{', '').replace('}', '');
				changes.push(change);
			});

		return applyChanges(tree, appModulePath, changes);
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
		const appModuleContent = readFile(tree, appModulePath);
		tree.overwrite(appModulePath, appModuleContent.replace(/@NgModule/, replacement));
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
			const changes = [insertImport(sourceFile, 'app.module.ts', 'ObMasterLayoutConfig', OBLIQUE_PACKAGE)];
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
	const translateModuleName = ' TranslateModule ';
	const translateSource = '@ngx-translate/core';
	const translateModuleImport = 'TranslateModule.forRoot(multiTranslateLoader())';
	const appModule = readFile(tree, appModulePath);
	const sourceFile = createSrcFile(tree, appModulePath);
	const changes: Change[] = [];

	if (!appModule.split('@NgModule')[1].includes(translateModuleName)) {
		addImportToModule(sourceFile, appModulePath, translateModuleImport, translateSource).forEach((change: Change) => changes.push(change));
		if (changes.length > 1) {
			(changes[1] as InsertChange).toAdd = `; \nimport {${translateModuleName}} from '${translateSource}'`;
		}
	}

	changes.push(insertImport(sourceFile, appModulePath, 'multiTranslateLoader', OBLIQUE_PACKAGE));
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
