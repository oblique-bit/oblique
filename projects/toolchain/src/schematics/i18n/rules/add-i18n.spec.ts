import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import type {ObGroupLogger} from '../../../logger';
import {runRule} from '../../test-utils';
import {i18n} from '../index';
import {addI18n} from './add-i18n';
import {
	appModuleWithExistingTranslations,
	appModuleWithLocaleId,
	appModuleWithObliqueConfig,
	appModuleWithRegisteredLocales,
	basicAppModule,
	basicPackageJson,
} from './test-utils';

describe('i18n schematic', () => {
	const locales = ['de-CH', 'fr-CH', 'it-CH'];
	let runner: SchematicTestRunner;
	let tree: UnitTestTree;
	let resultTree: UnitTestTree;

	beforeAll(async () => {
		runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
		tree = new UnitTestTree(Tree.empty());
		tree.create('src/app/app-module.ts', basicAppModule());
		tree.create('package.json', basicPackageJson());
		resultTree = await runRule(runner, i18n({silent: false, locales}), {tree, path: __dirname});
	});

	describe('LOCALE_ID', () => {
		test('provider added with first locale', () => {
			expect(resultTree.readContent('src/app/app-module.ts')).toContain("{provide: LOCALE_ID, useValue: 'de-CH'}");
		});
		test('LOCALE_ID imported from @angular/core', () => {
			const content = resultTree.readContent('src/app/app-module.ts');
			expect(content).toContain('LOCALE_ID');
			expect(content).toContain('@angular/core');
		});
	});

	test('configures the current Angular app-module filename', async () => {
		const appModuleTree = new UnitTestTree(Tree.empty());
		appModuleTree.create('src/app/app-module.ts', basicAppModule());
		appModuleTree.create('package.json', basicPackageJson());

		const appModuleResult = await runRule(runner, i18n({silent: false, locales: ['de-CH']}), {
			tree: appModuleTree,
			path: __dirname,
		});

		expect(appModuleResult.readContent('src/app/app-module.ts')).toContain("{provide: LOCALE_ID, useValue: 'de-CH'}");
	});

	describe('registerLocaleData', () => {
		const getContent = (): string => resultTree.readContent('src/app/app-module.ts');

		test('registerLocaleData imported', () => {
			const content = getContent();
			expect(content).toContain('registerLocaleData');
			expect(content).toContain('@angular/common');
		});
		test('locale data imported for each locale', () => {
			expect(getContent()).toContain("import localeDECH from '@angular/common/locales/de-CH';");
			expect(getContent()).toContain("import localeFRCH from '@angular/common/locales/fr-CH';");
			expect(getContent()).toContain("import localeITCH from '@angular/common/locales/it-CH';");
		});
		test('registerLocaleData called for each locale in module body', () => {
			expect(getContent()).toContain('registerLocaleData(localeDECH);');
			expect(getContent()).toContain('registerLocaleData(localeFRCH);');
			expect(getContent()).toContain('registerLocaleData(localeITCH);');
		});
	});

	describe('provideObliqueConfiguration', () => {
		test('locale config merged with all locales', () => {
			expect(resultTree.readContent('src/app/app-module.ts')).toContain(
				"accessibilityStatement: {\n\tapplicationName: 'Test application'"
			);
			expect(resultTree.readContent('src/app/app-module.ts')).toContain(
				"translate: {locales: {locales: ['de-CH', 'fr-CH', 'it-CH'], defaultLanguage: 'de', disabled: false, languages: {de: 'DE', fr: 'FR', it: 'IT'}}}"
			);
		});
	});

	describe('translation files', () => {
		test('does not import the removed TranslateModule', () => {
			expect(resultTree.readContent('src/app/app-module.ts')).not.toContain('TranslateModule');
		});

		test('de.json created with empty object', () => {
			expect(resultTree.readContent('src/assets/i18n/de.json')).toBe('{}');
		});
		test('fr.json created with empty object', () => {
			expect(resultTree.readContent('src/assets/i18n/fr.json')).toBe('{}');
		});
		test('it.json created with empty object', () => {
			expect(resultTree.readContent('src/assets/i18n/it.json')).toBe('{}');
		});
	});

	describe('idempotent', () => {
		let idempotentTree: UnitTestTree;
		beforeAll(async () => {
			idempotentTree = await runRule(runner, i18n({silent: false, locales}), {tree: resultTree, path: __dirname});
		});
		test('no duplicate providers/imports/calls/files', () => {
			const idempotentContent = idempotentTree.readContent('src/app/app-module.ts');
			expect(idempotentContent).toContain("{provide: LOCALE_ID, useValue: 'de-CH'}");

			expect(idempotentContent).toContain("import localeDECH from '@angular/common/locales/de-CH';");
			expect(idempotentContent).toContain("import localeFRCH from '@angular/common/locales/fr-CH';");
			expect(idempotentContent).toContain("import localeITCH from '@angular/common/locales/it-CH';");
			expect(idempotentContent).toContain('registerLocaleData(localeDECH);');
			expect(idempotentContent).toContain('registerLocaleData(localeFRCH);');
			expect(idempotentContent).toContain('registerLocaleData(localeITCH);');
			expect(idempotentContent).toContain(
				"translate: {locales: {locales: ['de-CH', 'fr-CH', 'it-CH'], defaultLanguage: 'de', disabled: false, languages: {de: 'DE', fr: 'FR', it: 'IT'}}}"
			);
		});
	});

	describe('with pre-existing config', () => {
		let preExistingResultTree: UnitTestTree;
		beforeAll(async () => {
			const preExistingTree = new UnitTestTree(Tree.empty());
			preExistingTree.create('src/app/app-module.ts', appModuleWithObliqueConfig());
			preExistingTree.create('package.json', basicPackageJson());
			preExistingResultTree = await runRule(runner, i18n({silent: false, locales}), {
				tree: preExistingTree,
				path: __dirname,
			});
		});
		test('config merged with all locales', () => {
			expect(preExistingResultTree.readContent('src/app/app-module.ts')).toContain(
				"translate: {locales: {locales: ['de-CH', 'fr-CH', 'it-CH'], defaultLanguage: 'de', disabled: false, languages: {de: 'DE', fr: 'FR', it: 'IT'}}}"
			);
		});
	});

	describe('with single locale', () => {
		let singleLocaleResultTree: UnitTestTree;
		beforeAll(async () => {
			const singleLocaleTree = new UnitTestTree(Tree.empty());
			singleLocaleTree.create('src/app/app-module.ts', basicAppModule());
			singleLocaleTree.create('package.json', basicPackageJson());
			singleLocaleResultTree = await runRule(runner, i18n({silent: false, locales: ['en-US']}), {
				tree: singleLocaleTree,
				path: __dirname,
			});
		});
		test('uses that locale for LOCALE_ID', () => {
			expect(singleLocaleResultTree.readContent('src/app/app-module.ts')).toContain(
				"{provide: LOCALE_ID, useValue: 'en-US'}"
			);
		});
		test('registers only one locale', () => {
			const singleLocaleContent = singleLocaleResultTree.readContent('src/app/app-module.ts');
			expect(singleLocaleContent).toContain("import localeENUS from '@angular/common/locales/en-US';");
			expect(singleLocaleContent).toContain('registerLocaleData(localeENUS);');
		});
		test('creates single translation file (en.json)', () => {
			expect(singleLocaleResultTree.readContent('src/assets/i18n/en.json')).toBe('{}');
			expect(singleLocaleResultTree.exists('src/assets/i18n/fr.json')).toBe(false);
		});
	});

	describe('with empty locales array', () => {
		let emptyResultTree: UnitTestTree;
		beforeAll(async () => {
			const emptyTree = new UnitTestTree(Tree.empty());
			emptyTree.create('src/app/app-module.ts', basicAppModule());
			emptyTree.create('package.json', basicPackageJson());
			emptyResultTree = await runRule(runner, i18n({silent: false, locales: []}), {tree: emptyTree, path: __dirname});
		});
		test('does not add LOCALE_ID provider', () => {
			expect(emptyResultTree.readContent('src/app/app-module.ts')).not.toContain('LOCALE_ID');
		});
		test('does not import registerLocaleData', () => {
			expect(emptyResultTree.readContent('src/app/app-module.ts')).not.toContain('registerLocaleData');
		});
		test('does not create translation files', () => {
			expect(emptyResultTree.exists('src/assets/i18n')).toBe(false);
		});
		test('does not change provideObliqueConfiguration', () => {
			expect(emptyResultTree.readContent('src/app/app-module.ts')).toContain('provideObliqueConfiguration');
			expect(emptyResultTree.readContent('src/app/app-module.ts')).not.toContain('translate:');
		});
	});

	describe('with existing LOCALE_ID provider', () => {
		let existingLocaleResultTree: UnitTestTree;
		beforeAll(async () => {
			const existingLocaleTree = new UnitTestTree(Tree.empty());
			existingLocaleTree.create('src/app/app-module.ts', appModuleWithLocaleId());
			existingLocaleTree.create('package.json', basicPackageJson());
			existingLocaleResultTree = await runRule(runner, i18n({silent: false, locales}), {
				tree: existingLocaleTree,
				path: __dirname,
			});
		});
		test('does not duplicate LOCALE_ID provider', () => {
			const existingLocaleContent = existingLocaleResultTree.readContent('src/app/app-module.ts');
			const localeIdRegex = /\{provide: LOCALE_ID/gu;
			const matches = existingLocaleContent.match(localeIdRegex) || [];
			expect(matches.length).toBe(1);
		});
		test('keeps original locale value', () => {
			expect(existingLocaleResultTree.readContent('src/app/app-module.ts')).toContain(
				"{provide: LOCALE_ID, useValue: 'en-US'}"
			); // original
		});
	});

	describe('with locales already registered', () => {
		let registeredResultTree: UnitTestTree;
		beforeAll(async () => {
			const registeredTree = new UnitTestTree(Tree.empty());
			registeredTree.create('src/app/app-module.ts', appModuleWithRegisteredLocales());
			registeredTree.create('package.json', basicPackageJson());
			registeredResultTree = await runRule(runner, i18n({silent: false, locales}), {
				tree: registeredTree,
				path: __dirname,
			});
		});
		test('skips already-registered locales', () => {
			const registeredContent = registeredResultTree.readContent('src/app/app-module.ts');
			const dechRegex = /registerLocaleData\(localeDECH\);/gu;
			const calls = registeredContent.match(dechRegex) || [];
			expect(calls.length).toBe(1); // not duplicated
		});
		test('still registers new locales', () => {
			expect(registeredResultTree.readContent('src/app/app-module.ts')).toContain('registerLocaleData(localeFRCH);');
		});
	});

	describe('with existing translation files', () => {
		let existingFilesResultTree: UnitTestTree;
		beforeAll(async () => {
			const existingFilesTree = new UnitTestTree(Tree.empty());
			existingFilesTree.create('src/app/app-module.ts', basicAppModule());
			existingFilesTree.create('package.json', basicPackageJson());
			existingFilesTree.create('src/assets/i18n/de.json', '{"existing": "value"}');
			existingFilesResultTree = await runRule(runner, i18n({silent: false, locales}), {
				tree: existingFilesTree,
				path: __dirname,
			});
		});
		test('does not overwrite existing translation files', () => {
			expect(existingFilesResultTree.readContent('src/assets/i18n/de.json')).toBe('{"existing": "value"}');
		});
		test('creates missing translation files', () => {
			expect(existingFilesResultTree.readContent('src/assets/i18n/fr.json')).toBe('{}');
		});
	});

	describe('defensive paths', () => {
		test('handles an unavailable initial app module buffer', async () => {
			const defensiveTree = new UnitTestTree(Tree.empty());
			defensiveTree.create('src/app/app-module.ts', appModuleWithExistingTranslations());
			defensiveTree.create('package.json', basicPackageJson());
			vi.spyOn(defensiveTree, 'read').mockImplementationOnce(() => null);
			const logger = {step: vi.fn()} as unknown as ObGroupLogger;

			await runRule(runner, addI18n(logger, ['de-CH']), {tree: defensiveTree, path: __dirname});

			expect(logger.step).toHaveBeenCalledWith('Adding locale management & translations');
		});

		test('does not duplicate an existing locale import without a registration call', async () => {
			const localeImportTree = new UnitTestTree(Tree.empty());
			localeImportTree.create(
				'src/app/app-module.ts',
				basicAppModule().replace('@NgModule', "import * as localeDECH from '@angular/common/locales/de-CH';\n@NgModule")
			);
			localeImportTree.create('package.json', basicPackageJson());

			const localeImportResultTree = await runRule(runner, i18n({silent: false, locales: ['de-CH']}), {
				tree: localeImportTree,
				path: __dirname,
			});
			const content = localeImportResultTree.readContent('src/app/app-module.ts');
			const imports = content.match(/from '@angular\/common\/locales\/de-CH';/gu);

			expect(imports).toHaveLength(1);
			expect(content).toContain('registerLocaleData(localeDECH);');
		});

		test('skips configuration when no app module exists', async () => {
			const missingAppModuleTree = new UnitTestTree(Tree.empty());
			missingAppModuleTree.create('package.json', basicPackageJson());

			const logger = {step: vi.fn()} as unknown as ObGroupLogger;

			await runRule(runner, addI18n(logger, ['de-CH']), {tree: missingAppModuleTree, path: __dirname});

			expect(logger.step).toHaveBeenCalledWith(
				expect.stringMatching(/^App module not found at .*skipping i18n configuration$/u)
			);
			expect(missingAppModuleTree.exists('src/assets/i18n/de.json')).toBe(false);
		});
	});
});
