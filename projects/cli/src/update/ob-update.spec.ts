import {Command, type OptionValues} from '@commander-js/extra-typings';
import path from 'node:path';
import fs from 'node:fs';
import type {PackageDependencies} from './ob-update.model';
import * as obUpdate from './ob-update';

describe('ObUpdateCommand Tests', () => {
	describe('functions ', () => {
		const nodeChildProcess: typeof import('node:child_process') = jest.requireActual('node:child_process');

		jest.mock('node:fs', () => ({
			readFileSync: jest.fn().mockImplementation(jest.fn())
		}));

		jest.mock('node:path', () => ({
			resolve: jest.fn().mockReturnValue('path')
		}));

		beforeAll(() => {
			jest.spyOn(console, 'info').mockImplementation(() => {});
			jest.spyOn(console, 'timeEnd').mockImplementation(() => {});
			jest.spyOn(console, 'error').mockImplementation(() => {});
		});

		beforeEach(() => {
			jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
			jest.spyOn(path, 'resolve').mockReturnValue('path');
		});

		describe('createObUpdateCommand', () => {
			beforeAll(() => {
				const obCliUtils: typeof import('../utils/cli-utils') = jest.requireActual('../utils/cli-utils');
				jest.spyOn(obCliUtils, 'commandUsageText').mockReturnValue('update');
				jest.spyOn(nodeChildProcess, 'execSync').mockImplementation(() => '');
				const cmd = obUpdate.createObUpdateCommand();
				// @ts-expect-error this is necessary to mock exit
				jest.spyOn(process, 'exit').mockImplementation(() => {});
				cmd.parse();
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

				test('with usage to be "update"', () => {
					expect(command.usage()).toBe('update');
				});

				describe('with help settings', () => {
					test('with help Information to be usage text', () => {
						expect(command.helpInformation()).toBe(
							`Usage: update update\n\nOptions:\n  -h, --help  Shows a help message for the "ob update" command in the console\n`
						);
					});
				});
			});
		});

		describe('findPackage', () => {
			test('should call path.resolve with process.cwd and package.json', () => {
				jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
				jest.spyOn(path, 'resolve').mockReturnValueOnce('path');
				obUpdate.findPackage();
				expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'package.json');
			});

			test('should call fs.readFileSync with "path" and "utf-8"', () => {
				jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
				jest.spyOn(path, 'resolve').mockReturnValueOnce('path');
				obUpdate.findPackage();
				expect(fs.readFileSync).toHaveBeenCalledWith('path', 'utf-8');
			});

			test('should JSON.parse with ', () => {
				jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
				jest.spyOn(path, 'resolve').mockReturnValueOnce('path');
				jest.spyOn(JSON, 'parse');
				obUpdate.findPackage();
				expect(JSON.parse).toHaveBeenCalledWith(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
			});

			test('should return parsed package.json content', () => {
				jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({dependencies: {jest: '^26.0.0'}} as PackageDependencies));
				(path.resolve as jest.Mock).mockReturnValue('path');

				const packageJson = obUpdate.findPackage();
				expect(packageJson).toEqual({dependencies: {jest: '^26.0.0'}});
			});

			test('should throw an error if package.json is not found', () => {
				(path.resolve as jest.Mock).mockReturnValueOnce('');
				expect(() => obUpdate.findPackage()).toThrow(
					`Cant find the package.json at path: ${[process.cwd(), 'package.json'].join('/')}. Please navigate to the level of your package.json and try "ob update" again.`
				);
			});
		});
	});
});
