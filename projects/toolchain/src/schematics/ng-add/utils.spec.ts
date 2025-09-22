import {mockFs} from '../test-utils';
mockFs('readFileSync'); // mockFs must come before imports because Jest caches all module dependencies on first import. If fs is already loaded, the mock won’t take effect.

import {HostTree, SchematicsException} from '@angular-devkit/schematics';
import {UnitTestTree} from '@angular-devkit/schematics/testing';
import {createFromTemplate} from './utils';
import * as fs from 'fs';
import {join} from 'node:path';

describe('createFromTemplate', () => {
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(new HostTree());
	});

	test('calls readFileSync with correct arguments', () => {
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'TEMPLATE CONTENT');
		createFromTemplate('target/path.txt', 'path.txt', inputTree);
		expect(fs.readFileSync).toHaveBeenCalledWith(join(__dirname, 'templates', 'path.txt'), 'utf8');
	});

	test("calls tree.create with correct arguments 'target/path.txt', and 'TEMPLATE CONTENT'", () => {
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'TEMPLATE CONTENT');
		jest.spyOn(inputTree, 'create');

		createFromTemplate('target/path.txt', 'template/path.txt', inputTree);
		expect(inputTree.create).toHaveBeenCalledWith('target/path.txt', 'TEMPLATE CONTENT');
	});

	test('returns the same tree instance', () => {
		const templatePath = './template/path.txt';
		inputTree.create(templatePath, 'Template Content');
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'TEMPLATE CONTENT');
		const result = createFromTemplate('/target/path.txt', templatePath, inputTree);
		expect(result).toBe(inputTree);
	});

	test('throws SchematicsException on file not found', () => {
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
			throw new Error('File not found');
		});
		expect(() => createFromTemplate('target/path.txt', 'template/missing.txt', inputTree)).toThrow(SchematicsException);
	});

	test('throws with correct error message on file not found', () => {
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
			throw new Error('File not found');
		});
		expect(() => createFromTemplate('target/path.txt', 'missing.txt', inputTree)).toThrow(
			`Template not found at: ${join(__dirname, 'templates', 'missing.txt')}`
		);
	});
});
