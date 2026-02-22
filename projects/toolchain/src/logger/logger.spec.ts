import {Logger} from './logger';
import type {Writer} from './types';
import {BaseLogger} from './base-logger';

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
});
