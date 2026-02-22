import {Logger} from './logger';
import type {Writer} from './types';
import chalk from 'chalk';

describe(Logger.name, () => {
	const message = 'Test message';
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

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('creation', () => {
		expect(logger).toBeTruthy();
	});

	describe.each([
		{method: 'info', prefix: 'ℹ INFO    ', color: chalk.blue},
		{method: 'success', prefix: '✔ SUCCESS ', color: chalk.green},
		{method: 'warn', prefix: '⚠ WARN    ', color: chalk.yellow},
		{method: 'error', prefix: '✖ ERROR   ', color: chalk.red},
	])('$method', ({prefix, method, color}) => {
		test(`print a formatted ${method} message`, () => {
			logger[method](message);
			expect(prefix.length).toBe(10);
			expect(writer[method]).toHaveBeenCalledWith(color(`${prefix}${message}`));
		});
	});

	describe(Logger.prototype.raw.name, () => {
		test('print a raw message', () => {
			logger.raw(message);
			expect(writer.raw).toHaveBeenCalledWith(message);
		});
	});
});
