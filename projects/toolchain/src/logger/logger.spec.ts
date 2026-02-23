import {Logger} from './logger';
import type {Writer} from './types';
import {BaseLogger} from './base-logger';
import {GroupLogger} from './group-logger';
import chalk from 'chalk';

describe(Logger.name, () => {
	let writer: jest.Mocked<Writer>;
	let logger: Logger;

	beforeEach(() => {
		writer = {
			info: jest.fn(),
			success: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			raw: jest.fn(),
		};

		logger = new Logger(writer);
	});

	test('creation', () => {
		expect(logger).toBeTruthy();
	});

	test('instance of BaseLogger', () => {
		expect(logger instanceof BaseLogger).toBe(true);
	});

	describe(Logger.prototype.group.name, () => {
		test('print a formatted info message', () => {
			logger.group('group');
			expect(writer.info).toHaveBeenCalledWith(chalk.blue('ℹ INFO    group'));
		});

		test('return an GroupLogger instance', () => {
			logger.group('group');
			expect(logger.group('group') instanceof GroupLogger).toBe(true);
		});
	});
});
