import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {addSymbolToNgModuleMetadata, insertImport} from '@schematics/angular/utility/ast-utils';
import {NodeDependencyType, addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {type Change, InsertChange} from '@schematics/angular/utility/change';
import {ScriptTarget, type SourceFile, createSourceFile} from 'typescript';
import type {ObGroupLogger} from '../../../logger';

const appModulePath = 'src/app/app-module.ts';
const ngxTranslateVersion = '^18.0.0';

/**
 * Creates a TypeScript SourceFile from a tree file for AST manipulation.
 */
function createSrcFile(tree: Tree, source: string): SourceFile {
	return createSourceFile(source, tree.readText(source), ScriptTarget.Latest, true);
}

/**
 * Applies InsertChange records to a file in the tree.
 */
function applyChanges(tree: Tree, filePath: string, changes: Change[]): Tree {
	const records = tree.beginUpdate(filePath);
	changes
		.filter((change): change is InsertChange => change instanceof InsertChange)
		.forEach((change: InsertChange) => {
			records.insertLeft(change.pos, change.toAdd);
		});
	tree.commitUpdate(records);
	return tree;
}

/**
 * Generates the variable name for a locale (e.g., 'de-CH' -> 'localeDECH').
 */
function getLocaleVariable(locale: string): string {
	return `locale${locale.replace('-', '').toUpperCase()}`;
}

/**
 * Checks if a locale is already registered in the app module.
 */
function filterLocale(tree: Tree, locale: string): boolean {
	const content = tree.readText(appModulePath);
	return !new RegExp(`registerLocaleData\\(${getLocaleVariable(locale)}\\)`, 'u').test(content);
}

/**
 * Checks if LOCALE_ID provider already exists in the app module.
 */
function hasLocaleIdProvider(tree: Tree): boolean {
	const content = tree.readText(appModulePath);
	return /\{provide:\s*LOCALE_ID/u.test(content);
}

function getLocaleChanges(tree: Tree, locales: string[]): Change[] {
	const sourceFile = createSrcFile(tree, appModulePath);
	const changes: Change[] = [
		insertImport(sourceFile, appModulePath, 'registerLocaleData', '@angular/common'),
		insertImport(sourceFile, appModulePath, 'LOCALE_ID', '@angular/core'),
	].filter((change: Change) => change instanceof InsertChange);
	if (!hasLocaleIdProvider(tree)) {
		changes.push(
			...addSymbolToNgModuleMetadata(
				sourceFile,
				appModulePath,
				'providers',
				`{provide: LOCALE_ID, useValue: '${locales[0]}'}`,
				null
			).filter((change): change is InsertChange => change instanceof InsertChange)
		);
	}
	return changes;
}

function getTranslateConfiguration(locales: string[]): string {
	const localesArray = `['${locales.join("', '")}']`;
	const defaultLanguage = locales[0].split('-')[0];
	return `{locales: {locales: ${localesArray}, defaultLanguage: '${defaultLanguage}', disabled: false}}`;
}

function mergeTranslateConfiguration(tree: Tree, translateConfiguration: string): boolean {
	const content = tree.readText(appModulePath);
	const configuredProvider = 'provideObliqueConfiguration({';
	if (content.includes(configuredProvider) && !content.includes('translate:')) {
		tree.overwrite(
			appModulePath,
			content.replace(configuredProvider, `${configuredProvider}translate: ${translateConfiguration}, `)
		);
		return true;
	}
	return false;
}

/**
 * Adds locale-related imports: registerLocaleData, LOCALE_ID, and locale data for each locale.
 */
function importLocales(logger: ObGroupLogger, locales: string[]): Rule {
	return tree => {
		logger.step('Adding locale management & translations');
		const sourceFile = createSrcFile(tree, appModulePath);
		const changes = getLocaleChanges(tree, locales);
		const toDefaultImport = (change: InsertChange): InsertChange =>
			new InsertChange(change.path, change.pos, change.toAdd.replace(/\s*\{\s*/u, ' ').replace(/\s*\}\s*/u, ' '));
		for (const locale of locales.filter(loc => filterLocale(tree, loc))) {
			const imp = insertImport(
				sourceFile,
				appModulePath,
				getLocaleVariable(locale),
				`@angular/common/locales/${locale}`
			);
			if (imp instanceof InsertChange) {
				changes.push(toDefaultImport(imp));
			}
		}
		return applyChanges(tree, appModulePath, changes);
	};
}

/**
 * Adds registerLocaleData calls for each locale in the module body.
 */
function registerLocales(logger: ObGroupLogger, locales: string[]): Rule {
	return tree => {
		logger.step('Registering locales');
		const registerCalls = locales
			.filter(locale => filterLocale(tree, locale))
			.map(locale => `registerLocaleData(${getLocaleVariable(locale)});`);
		const replacement = [...registerCalls, '\n@NgModule'].join('\n');
		tree.overwrite(appModulePath, tree.readText(appModulePath).replace('@NgModule', replacement));
		return tree;
	};
}

/**
 * Adds provideObliqueConfiguration import and provider with locale configuration.
 */
function configureLocales(logger: ObGroupLogger, locales: string[]): Rule {
	return tree => {
		logger.step('Configuring Oblique with locales');
		const translateConfiguration = getTranslateConfiguration(locales);
		if (mergeTranslateConfiguration(tree, translateConfiguration)) {
			return tree;
		}
		logger.step('Oblique configuration not found, skipping locale configuration');
		return tree;
	};
}

/**
 * Adds @ngx-translate/core dependency and creates translation files per locale.
 */
function addTranslation(logger: ObGroupLogger, locales: string[]): Rule {
	return tree => {
		addPackageJsonDependency(tree, {
			type: NodeDependencyType.Default,
			version: ngxTranslateVersion,
			name: '@ngx-translate/core',
		});

		locales
			.map(locale => locale.split('-')[0])
			.forEach((lang: string) => {
				const fileName = `src/assets/i18n/${lang}.json`;
				if (!tree.exists(fileName)) {
					tree.create(fileName, '{}');
				}
			});

		return tree;
	};
}

/**
 * Configures i18n for the given locales by chaining all locale rules.
 * Skips configuration if no locales provided or app module not found.
 */
export function addI18n(logger: ObGroupLogger, locales: string[]): Rule {
	return (tree: Tree, context: SchematicContext) => {
		if (locales.length === 0) {
			logger.step('No locales provided, skipping i18n configuration');
			return tree;
		}

		if (!tree.exists(appModulePath)) {
			logger.step(`App module not found at ${appModulePath}, skipping i18n configuration`);
			return tree;
		}

		logger.step(`Configure i18n for locales: ${locales.join(', ')}`);

		return chain([
			importLocales(logger, locales),
			registerLocales(logger, locales),
			configureLocales(logger, locales),
			addTranslation(logger, locales),
		])(tree, context);
	};
}

export default addI18n;
