import type {SchematicContext} from '@angular-devkit/schematics';
import {Logger} from './logger';
import type {ObLogger} from './logger.types';
import {obCreateLogger, obCreateSchematicsLogger} from './factory';

describe('logger-factory', () => {
	describe(obCreateLogger.name, () => {
		let logger: ObLogger;
		describe('not silent', () => {
			beforeEach(() => {
				jest.spyOn(console, 'info').mockImplementation(() => {});
				jest.spyOn(console, 'warn').mockImplementation(() => {});
				jest.spyOn(console, 'error').mockImplementation(() => {});
				logger = obCreateLogger();
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			test('instance of Logger', () => {
				expect(logger instanceof Logger).toBe(true);
			});

			describe(Logger.prototype.info, () => {
				test('calls console.info', () => {
					logger.info('test');
					expect(console.info).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.success, () => {
				test('calls console.info', () => {
					logger.success('test');
					expect(console.info).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.warn, () => {
				test('calls console.warn', () => {
					logger.warn('test');
					expect(console.warn).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.error, () => {
				test('calls console.error', () => {
					logger.error('test');
					expect(console.error).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.raw, () => {
				test('calls console.info', () => {
					logger.raw('test');
					expect(console.info).toHaveBeenCalled();
				});
			});
		});

		describe('silent', () => {
			beforeEach(() => {
				jest.spyOn(console, 'info').mockImplementation(() => {});
				jest.spyOn(console, 'warn').mockImplementation(() => {});
				jest.spyOn(console, 'error').mockImplementation(() => {});
				logger = obCreateLogger(true);
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			test('instance of Logger', () => {
				expect(logger instanceof Logger).toBe(true);
			});

			describe('log methods', () => {
				test.each(['info', 'warn', 'error'])("doesn't call console.%s", method => {
					logger.info('test');
					logger.success('test');
					logger.error('test');
					logger.warn('test');
					logger.raw('test');
					// eslint-disable-next-line no-console
					expect(console[method]).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe(obCreateSchematicsLogger.name, () => {
		const context = {info: jest.fn(), success: jest.fn(), warn: jest.fn(), error: jest.fn()};
		let logger: ObLogger;

		describe('not silent', () => {
			beforeEach(() => {
				logger = obCreateSchematicsLogger({logger: context} as unknown as SchematicContext);
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			test('instance of Logger', () => {
				expect(logger instanceof Logger).toBe(true);
			});

			describe(Logger.prototype.info, () => {
				test('calls context.logger.info', () => {
					logger.info('test');
					expect(context.info).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.success, () => {
				test('calls context.logger.info', () => {
					logger.success('test');
					expect(context.info).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.warn, () => {
				test('calls context.logger.warn', () => {
					logger.warn('test');
					expect(context.warn).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.error, () => {
				test('calls context.logger.error', () => {
					logger.error('test');
					expect(context.error).toHaveBeenCalled();
				});
			});

			describe(Logger.prototype.raw, () => {
				test('calls context.logger.info', () => {
					logger.raw('test');
					expect(context.info).toHaveBeenCalled();
				});
			});
		});

		describe('silent', () => {
			beforeEach(() => {
				logger = obCreateSchematicsLogger({logger: context} as unknown as SchematicContext, true);
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			test('instance of Logger', () => {
				expect(logger instanceof Logger).toBe(true);
			});

			describe('log methods', () => {
				test.each(['info', 'warn', 'error'])("doesn't call console.%s", method => {
					logger.info('test');
					logger.success('test');
					logger.error('test');
					logger.warn('test');
					logger.raw('test');
					// eslint-disable-next-line no-console
					expect(console[method]).not.toHaveBeenCalled();
				});
			});
		});
	});
});
