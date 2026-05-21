import {HostTree, type Tree} from '@angular-devkit/schematics';
import {UnitTestTree} from '@angular-devkit/schematics/testing';
import {addPropertyToJsonFile, deletePropertyFromJsonFile, readJson} from './json';

describe('json', () => {
	const packageJson = 'package.json';

	describe(readJson.name, () => {
		let inputTree: UnitTestTree;

		beforeEach(() => {
			inputTree = new UnitTestTree(new HostTree());
		});

		test('throws and logs error when package.json do not exists', () => {
			expect(() => readJson(inputTree, packageJson)).toThrow('ObSchematicsError - Path "package.json" does not exist');
		});

		test('throws and logs error when package.json is not json', () => {
			inputTree.create(packageJson, '');
			expect(() => readJson(inputTree, packageJson)).toThrow(
				'ObSchematicsError - Failed to parse "package.json" as JSON. ValueExpected at offset: 0'
			);
		});

		test.each([[], null, 42, 'string'])('throws and logs error when package.json is invalid "%s"', value => {
			inputTree.create(packageJson, JSON.stringify(value));
			expect(() => readJson(inputTree, packageJson)).toThrow(
				'ObSchematicsError - Failed to parse "package.json" as JSON. Object expected at offset: 0'
			);
		});

		test('parse valid package.json', () => {
			const pkg = {dependencies: {}, devDependencies: {}};
			inputTree.create(packageJson, JSON.stringify(pkg));
			expect(readJson(inputTree, packageJson)).toEqual(pkg);
		});

		test('with custom error', () => {
			expect(() =>
				readJson(
					{
						exists: () => true,
						readJson: () => {
							throw 'asdf';
						},
					} as unknown as Tree,
					packageJson
				)
			).toThrow('ObSchematicsError - Failed to parse "package.json" as JSON. Object expected at offset: 0');
		});
	});

	describe(addPropertyToJsonFile.name, () => {
		let inputTree: UnitTestTree;

		beforeEach(() => {
			inputTree = new UnitTestTree(new HostTree());
		});

		test('overwrite existing root property', () => {
			inputTree.create(packageJson, '{"overwrite": true, "keep": true}');
			addPropertyToJsonFile(inputTree, packageJson, {key: 'overwrite', value: false});

			expect(inputTree.readContent(packageJson)).toBe('{"overwrite": false, "keep": true}');
		});

		test('add new root property', () => {
			inputTree.create(packageJson, '{"keep": true}');
			addPropertyToJsonFile(inputTree, packageJson, {key: 'add', value: true});

			expect(inputTree.readContent(packageJson)).toBe('{"keep": true,"add": true}');
		});

		test('overwrite existing nested property', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true, "overwrite": true},"keep": true}');
			addPropertyToJsonFile(inputTree, packageJson, {key: 'nested.overwrite', value: false});

			expect(inputTree.readContent(packageJson)).toBe('{"nested": {"keep": true, "overwrite": false},"keep": true}');
		});

		test('add new nested property', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true}, "keep": true}');
			addPropertyToJsonFile(inputTree, packageJson, {key: 'nested.add', value: true});

			expect(inputTree.readContent(packageJson)).toBe('{"nested": {"keep": true,"add": true}, "keep": true}');
		});

		test('add property in non existing parent', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true}, "keep": true}');
			addPropertyToJsonFile(inputTree, packageJson, {key: 'nested.overwrite.property', value: true});

			expect(inputTree.readContent(packageJson)).toBe(
				'{"nested": {"keep": true,"overwrite": {"property":true}}, "keep": true}'
			);
		});

		test('inexistent package.json', () => {
			expect(() => {
				addPropertyToJsonFile(inputTree, packageJson, {key: 'property', value: 'hello'});
			}).toThrow('ObSchematicsError - Path "package.json" does not exist');
		});
	});

	describe(deletePropertyFromJsonFile.name, () => {
		let inputTree: UnitTestTree;

		beforeEach(() => {
			inputTree = new UnitTestTree(new HostTree());
		});

		test('delete existing root property', () => {
			inputTree.create(packageJson, '{"remove": true, "keep": true}');
			deletePropertyFromJsonFile(inputTree, packageJson, 'remove');

			expect(inputTree.readContent(packageJson)).toBe('{"keep": true}');
		});

		test('delete existing nested property', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true, "remove": true}, "keep": true}');
			deletePropertyFromJsonFile(inputTree, packageJson, 'nested.remove');

			expect(inputTree.readContent(packageJson)).toBe('{"nested": {"keep": true}, "keep": true}');
		});

		test('delete non existing root property', () => {
			inputTree.create(packageJson, '{"remove": true, "keep": true}');
			deletePropertyFromJsonFile(inputTree, packageJson, 'property');

			expect(inputTree.readContent(packageJson)).toBe('{"remove": true, "keep": true}');
		});

		test('delete non existing nested property', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true, "remove": true}, "keep": true}');
			deletePropertyFromJsonFile(inputTree, packageJson, 'nested.property');

			expect(inputTree.readContent(packageJson)).toBe('{"nested": {"keep": true, "remove": true}, "keep": true}');
		});

		test('delete property in non existing parent', () => {
			inputTree.create(packageJson, '{"nested": {"keep": true}, "keep": true}');
			deletePropertyFromJsonFile(inputTree, packageJson, 'nested.remove.property');

			expect(inputTree.readContent(packageJson)).toBe('{"nested": {"keep": true}, "keep": true}');
		});

		test('inexistent package.json', () => {
			expect(() => {
				deletePropertyFromJsonFile(inputTree, packageJson, 'property');
			}).toThrow('ObSchematicsError - Path "package.json" does not exist');
		});
	});
});
