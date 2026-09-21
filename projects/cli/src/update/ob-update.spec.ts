import {Command, type OptionValues} from '@commander-js/extra-typings';
import type {Mock} from 'vitest';
import * as path from 'node:path';
import fs from 'node:fs';
import type {PackageDependencies} from './ob-update.model.js';
import * as obUpdate from './ob-update.js';
import * as nodeChildProcess from 'node:child_process';
import {execute} from '../utils/cli-utils.js';
vi.mock('../utils/cli-utils.js', async () => ({
	...((await vi.importActual<typeof import('../utils/cli-utils.js')>('../utils/cli-utils.js')) as object),
	execute: vi.fn(),
}));
vi.mock('node:child_process', async () => ({
	...((await vi.importActual<typeof import('node:child_process')>('node:child_process')) as object),
}));
vi.mock('node:fs', async () => {
	const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
	const mockFs = {...actual};
	return {...mockFs, default: mockFs};
});
vi.mock('node:path', async () => {
	const actual = await vi.importActual<typeof import('node:path')>('node:path');
	const mockPath = {...actual};
	return {...mockPath, default: mockPath};
});

describe('ObUpdateCommand Tests', () => {
	describe('functions ', () => {
		beforeAll(() => {
			vi.spyOn(console, 'info').mockImplementation(() => {});
			vi.spyOn(console, 'timeEnd').mockImplementation(() => {});
			vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.spyOn(console, 'warn').mockImplementation(() => {});
		});

		beforeEach(() => {
			vi.spyOn(fs, 'readFileSync').mockReturnValue(
				JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
			);
			vi.spyOn(path, 'resolve').mockReturnValue('path');
		});

		describe('createObUpdateCommand', () => {
			beforeAll(() => {
				vi.spyOn(fs, 'readFileSync').mockReturnValue(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
				vi.spyOn(path, 'resolve').mockReturnValue('path');
				vi.spyOn(nodeChildProcess, 'execSync').mockImplementation(() => '');
				const cmd = obUpdate.createObUpdateCommand();
				// @ts-expect-error this is necessary to mock exit
				vi.spyOn(process, 'exit').mockImplementation(() => {});
				cmd.parse([], {from: 'user'});
			});

			describe('should get back the command ', () => {
				let command: Command<[string], OptionValues>;
				beforeEach(() => {
					command = obUpdate.createObUpdateCommand();
				});

				test('of instance Command', () => {
					expect(command).toBeInstanceOf(Command<[string], OptionValues>);
				});

				test('with name update', () => {
					expect(command.name()).toBe('update');
				});

				test('with name to be "update"', () => {
					expect(command.name()).toBe('update');
				});

				test('with description to be ""', () => {
					expect(command.description()).toBe('');
				});

				test('with summary to be "Updates Oblique and runs the migration."', () => {
					expect(command.summary()).toBe('Updates Oblique and runs the migration.');
				});

				test('with usage to be " "', () => {
					expect(command.usage()).toBe(' ');
				});

				describe('with help settings', () => {
					test('with help Information to be usage text', () => {
						expect(cleanOutput(command.helpInformation())).toBe(
							`Usage: update Options: --verbose [boolean] Enables verbose mode for the Oblique's "update" Schematic. (default: false) --force [boolean] Enables force mode for the Oblique's "update" Schematic. (default: true) --allow-dirty [boolean] Enables allow-dirty mode for the Oblique's "update" Schematic. (default: true) -h, --help Shows a help message for the "ob update" command in the console`
						);
					});
				});
			});
		});

		describe('findPackage', () => {
			test('should call path.resolve with process.cwd and package.json', () => {
				vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
				vi.spyOn(path, 'resolve').mockReturnValueOnce('path');
				obUpdate.findPackage();
				expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'package.json');
			});

			test('should call fs.readFileSync with "path" and "utf-8"', () => {
				vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
				vi.spyOn(path, 'resolve').mockReturnValueOnce('path');
				obUpdate.findPackage();
				expect(fs.readFileSync).toHaveBeenCalledWith('path', 'utf-8');
			});

			test('should JSON.parse with ', () => {
				vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
				vi.spyOn(path, 'resolve').mockReturnValueOnce('path');
				vi.spyOn(JSON, 'parse');
				obUpdate.findPackage();
				expect(JSON.parse).toHaveBeenCalledWith(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
			});

			test('should return parsed package.json content', () => {
				vi.spyOn(fs, 'readFileSync').mockReturnValue(
					JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies)
				);
				vi.mocked(path.resolve).mockReturnValue('path');

				const packageJson = obUpdate.findPackage();
				expect(packageJson).toEqual({dependencies: {jest: '^26.0.0'}});
			});

			test('should throw an error if package.json is not found', () => {
				vi.mocked(path.resolve).mockReturnValueOnce('');
				expect(() => obUpdate.findPackage()).toThrow(
					`Cant find the package.json at path: ${[process.cwd(), 'package.json'].join('/')}. Please navigate to the level of your package.json and try "ob update" again.`
				);
			});
		});

		describe('runUpdateDependencies', () => {
			describe('successful execution', () => {
				beforeEach(() => {
					vi.spyOn(obUpdate, 'isDependencyInPackage').mockImplementation(dependency => dependency === 'jest');

					vi.spyOn(obUpdate, 'findPackage').mockReturnValue({
						dependencies: {jest: '29.0.0'},
					});

					obUpdate.runUpdateDependencies({force: true, verbose: false, 'allow-dirty': true});
				});

				test('calls execute', () => {
					expect(execute).toHaveBeenCalledTimes(6);
				});

				test('uses ngUpdate command', () => {
					expect(execute).toHaveBeenCalledWith(expect.objectContaining({name: 'ngUpdate'}));
				});

				test('passes filtered dependencies', () => {
					expect(execute).toHaveBeenCalledWith(
						expect.objectContaining({
							dependencies: ['jest'],
						})
					);
				});

				test('passes force option', () => {
					expect(execute).toHaveBeenCalledWith(
						expect.objectContaining({
							options: {'allow-dirty': true, force: true},
						})
					);
				});

				test('passes angularDependencies from package', () => {
					expect(execute).toHaveBeenCalledWith(
						expect.objectContaining({
							angularDependencies: [],
						})
					);
				});
			});
			describe('empty package', () => {
				beforeEach(() => {
					vi.spyOn(obUpdate, 'isDependencyInPackage').mockImplementation(() => true);
					vi.spyOn(obUpdate, 'findPackage').mockReturnValue({
						dependencies: {},
					});
					vi.spyOn(console, 'error').mockImplementation(() => {});
					obUpdate.runUpdateDependencies({force: true, verbose: false, 'allow-dirty': true});
				});

				test('uses ngUpdate command', () => {
					expect(execute).toHaveBeenCalledWith(expect.objectContaining({name: 'ngUpdate'}));
				});

				test('passes no  empty angular dependencies', () => {
					expect(execute).toHaveBeenCalledWith(
						expect.objectContaining({
							angularDependencies: [],
						})
					);
				});
			});

			test('filters non-updatable angular dependencies', () => {
				(execute as Mock).mockClear();
				vi.spyOn(fs, 'readFileSync').mockReturnValue(
					JSON.stringify({
						dependencies: {
							'@angular/flex-layout': '15.0.0',
							'@angular/core': '21.0.0',
						},
					} as PackageDependencies)
				);
				vi.spyOn(obUpdate, 'isDependencyInPackage').mockImplementation(() => false);

				obUpdate.runUpdateDependencies({force: true, verbose: false, 'allow-dirty': true});

				expect(execute).toHaveBeenCalledWith(
					expect.objectContaining({
						name: 'ngUpdate',
						angularDependencies: ['@angular/core'],
					})
				);
			});

			describe('error handling', () => {
				beforeEach(() => {
					vi.spyOn(obUpdate, 'isDependencyInPackage').mockReturnValue(true);
					vi.spyOn(obUpdate, 'findPackage').mockReturnValue({
						dependencies: {jest: '29.0.0'},
					});

					vi.spyOn(console, 'error').mockImplementation(() => {});
					(execute as Mock).mockImplementation(() => {
						throw new Error('boom');
					});

					obUpdate.runUpdateDependencies({force: true, verbose: false, 'allow-dirty': true});
				});

				test('logs error to console', () => {
					expect(console.error).toHaveBeenCalledTimes(2);
				});
			});
		});
	});

	function cleanOutput(output: string): string {
		return output.replace(/\s+/gu, ' ').trim();
	}
});
