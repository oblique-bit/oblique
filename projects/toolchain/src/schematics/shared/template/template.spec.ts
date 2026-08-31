import {HostTree, template} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {mkdirSync, rmSync, writeFileSync} from 'fs';
import {runRule} from '../../test-utils';
import {createFromTemplate} from './template';

const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../../collection.json'));

describe(createFromTemplate.name, () => {
	const templateDir = path.join(__dirname, 'templates');
	afterEach(() => {
		rmSync(templateDir, {recursive: true, force: true});
	});

	test('template folder does not exist', async () => {
		const tree = await runRule(runner, createFromTemplate('./templates'), {
			tree: new UnitTestTree(new HostTree()),
			path: __dirname,
		});

		expect(tree.files).toEqual([]);
	});

	test('template folder is empty', async () => {
		mkdirSync(templateDir);
		const tree = await runRule(runner, createFromTemplate('./templates'), {
			tree: new UnitTestTree(new HostTree()),
			path: __dirname,
		});

		expect(tree.files).toEqual([]);
	});

	test('template folder is not empty', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, 'test.txt'), '');
		const tree = await runRule(runner, createFromTemplate('./templates'), {
			tree: new UnitTestTree(new HostTree()),
			path: __dirname,
		});

		expect(tree.files).toEqual(['/test.txt']);
	});

	test('template folder has multiple files', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, 'test.txt'), '');
		writeFileSync(path.join(templateDir, 'test2.txt'), '');
		const tree = await runRule(runner, createFromTemplate('./templates'), {
			tree: new UnitTestTree(new HostTree()),
			path: __dirname,
		});

		expect(tree.files).toEqual(['/test.txt', '/test2.txt']);
	});

	test('options', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, '__name__.ts'), '<%= name %>');
		const tree = await runRule(runner, createFromTemplate('./templates', [template({name: 'hello'})]), {
			tree: new UnitTestTree(new HostTree()),
			path: __dirname,
		});

		expect(tree.files[0]).toBe('/hello.ts');
		expect(tree.readContent(tree.files[0])).toBe('hello');
	});
});
