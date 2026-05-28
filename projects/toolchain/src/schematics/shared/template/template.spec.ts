import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {HostTree} from '@angular-devkit/schematics';
import {mkdirSync, rmSync, writeFileSync} from 'fs';

const runner = new SchematicTestRunner('test', path.join(__dirname, './template.json'));

describe('createFromTemplate schematic', () => {
	const templateDir = path.join(__dirname, 'templates');
	afterEach(() => {
		rmSync(templateDir, {recursive: true, force: true});
	});

	test('template folder does not exist', async () => {
		const tree = await runner.runSchematic('template', {}, new UnitTestTree(new HostTree()));

		expect(tree.files).toEqual([]);
	});

	test('template folder is empty', async () => {
		mkdirSync(templateDir);
		const tree = await runner.runSchematic('template', {}, new UnitTestTree(new HostTree()));

		expect(tree.files).toEqual([]);
	});

	test('template folder is not empty', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, 'test.txt'), '');
		const tree = await runner.runSchematic('template', {}, new UnitTestTree(new HostTree()));

		expect(tree.files).toEqual(['/test.txt']);
	});

	test('template folder has multiple files', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, 'test.txt'), '');
		writeFileSync(path.join(templateDir, 'test2.txt'), '');
		const tree = await runner.runSchematic('template', {}, new UnitTestTree(new HostTree()));

		expect(tree.files).toEqual(['/test.txt', '/test2.txt']);
	});

	test('options', async () => {
		mkdirSync(templateDir);
		writeFileSync(path.join(templateDir, '__name__.ts'), '<%= name %>');
		const tree = await runner.runSchematic('templateOptions', {name: 'hello'}, new UnitTestTree(new HostTree()));

		expect(tree.files[0]).toBe('/hello.ts');
		expect(tree.readContent(tree.files[0])).toBe('hello');
	});
});
