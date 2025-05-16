import {SchematicTestRunner, type UnitTestTree} from '@angular-devkit/schematics/testing';
import {Tree} from '@angular-devkit/schematics';
import path from 'path';

describe('helloWorld schematic', () => {
	const collectionPath = path.join(__dirname, '../collection.json');
	const runner = new SchematicTestRunner('schematics', collectionPath);
	const testOptions = {name: 'hello-world.txt', content: 'Hello world! BliBlaBlubb'};
	let tree: UnitTestTree;

	beforeAll(async () => {
		tree = await runner.runSchematic('hello-world', testOptions, Tree.empty());
	});
	test(`should create a hello.txt file with content ${testOptions.content}`, () => {
		const content = tree.readContent(testOptions.name);
		expect(content).toBe(`${testOptions.content} example`);
	});

	test(`should create a hello.txt file with name ${testOptions.name}`, () => {
		const filePath = tree.files.find(file => file);
		expect(filePath).toBe(`/${testOptions.name}`);
	});
});
