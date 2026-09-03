import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {addOblique} from './index';
import * as addFaviconRules from './rules/add-favicon';
import {addFavicon} from './rules/add-favicon';

describe('addOblique schematics', () => {
	const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
	const {logger, loggerGroups} = obMockLogger();

	function createInputTree(): UnitTestTree {
		const tree = new UnitTestTree(Tree.empty());
		tree.create(
			'package.json',
			JSON.stringify({
				name: 'test-app',
				version: '0.0.0',
				dependencies: {'@angular/core': '^18.0.0', '@angular/common': '^18.0.0', '@oblique/oblique': '^16.0.0'},
			})
		);
		tree.create(
			'src/app/app-module.ts',
			`import { NgModule } from '@angular/core';\n@NgModule({})\nexport class AppModule {}`
		);
		return tree;
	}

	test('orchestration', async () => {
		const inputTree = createInputTree();
		vi.spyOn(addFaviconRules, 'addFavicon');

		await runRule(testRunner, addOblique({locale: 'de-CH fr-CH', silent: false}), {
			tree: inputTree,
			path: __dirname,
		});

		expect(logger.group).toHaveBeenCalledWith('Generate @oblique/toolchain:add-oblique');
		expect(addFavicon).toHaveBeenCalledTimes(1);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});

	test('calls i18n schematic with locales', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(testRunner, addOblique({locale: 'de-CH fr-CH', silent: false}), {
			tree: inputTree,
			path: __dirname,
		});

		expect(resultTree.exists('src/assets/i18n/de.json')).toBe(true);
		expect(resultTree.exists('src/assets/i18n/fr.json')).toBe(true);
		expect(resultTree.readContent('src/assets/i18n/de.json')).toBe('{}');
		expect(resultTree.readContent('src/assets/i18n/fr.json')).toBe('{}');
	});
});
