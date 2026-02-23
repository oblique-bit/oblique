import type {Writer} from './types';
import {GroupLogger} from './group-logger';
import {Logger} from './logger';
import {BaseLogger} from './base-logger';
import chalk from 'chalk';
import {ObLoggerNoActiveStepError} from './errors/ob-logger-error-no-active-step';
import {ObLoggerInactiveGroupError} from './errors/ob-logger-error-inactive-group';

class FakeClock {
	private time: number;
	private readonly spy: jest.SpyInstance<number, []>;

	constructor(startMillis: number) {
		this.time = startMillis;
		this.spy = jest.spyOn(globalThis.performance, 'now').mockImplementation(() => this.time);
	}

	tick(millis: number): void {
		this.time += millis;
	}
	restore(): void {
		this.spy.mockRestore();
	}
}

describe(GroupLogger.name, () => {
	let writer: jest.Mocked<Writer>;
	let logger: GroupLogger;
	let fakeClock: FakeClock; // used to simulate execution time

	beforeEach(() => {
		writer = {
			info: jest.fn(),
			success: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			raw: jest.fn(),
		};

		fakeClock = new FakeClock(0);
		logger = new GroupLogger(writer, {indentation: 1, parent: new Logger(writer), group: 'group'});
	});

	afterEach(() => {
		fakeClock.restore();
	});

	test('creation', () => {
		expect(logger).toBeTruthy();
	});

	test('instance of BaseLogger', () => {
		expect(logger instanceof BaseLogger).toBe(true);
	});

	describe('successful run without custom end message', () => {
		beforeEach(() => {
			logger.step('step 1');
			fakeClock.tick(200);
			logger.step('step 2');
			fakeClock.tick(900);
			logger.end();
		});

		test('1st, print a formatted info message for step 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(1, chalk.blue('  ℹ INFO    step 1'));
		});

		test('2nd, print a formatted success message for step 1', () => {
			expect(writer.success).toHaveBeenNthCalledWith(1, chalk.green('  ✔ SUCCESS step 1 (200.00ms)'));
		});

		test('3rd, print a formatted info message for step 2', () => {
			expect(writer.info).toHaveBeenNthCalledWith(2, chalk.blue('  ℹ INFO    step 2'));
		});

		test('4th, print a formatted success message for step 2', () => {
			expect(writer.success).toHaveBeenNthCalledWith(2, chalk.green('  ✔ SUCCESS step 2 (900.00ms)'));
		});

		test('5th, print a formatted success message for group closure', () => {
			expect(writer.success).toHaveBeenNthCalledWith(3, chalk.green('✔ SUCCESS group (1.10s)'));
		});

		test.each(['error', 'warn', 'raw'])('%s is not called', method => {
			expect(writer[method]).not.toHaveBeenCalled();
		});
	});

	describe('erroneous run with a custom end message', () => {
		beforeEach(() => {
			logger.step('step 1');
			fakeClock.tick(200);
			logger.stepError('error');
			logger.step('step 2');
			fakeClock.tick(900);
			logger.stepError();
			logger.end('finished');
		});

		test('1st, print a formatted info message for step 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(1, chalk.blue('  ℹ INFO    step 1'));
		});

		test('2nd, print a formatted error message for step 1', () => {
			expect(writer.error).toHaveBeenNthCalledWith(1, chalk.red('  ✖ ERROR   error (200.00ms)'));
		});

		test('3rd, print a formatted info message for step 2', () => {
			expect(writer.info).toHaveBeenNthCalledWith(2, chalk.blue('  ℹ INFO    step 2'));
		});

		test('4th, print a formatted success message for step 2', () => {
			expect(writer.error).toHaveBeenNthCalledWith(2, chalk.red('  ✖ ERROR   step 2 (900.00ms)'));
		});

		test('5th, print a formatted success message for group closure', () => {
			expect(writer.error).toHaveBeenNthCalledWith(3, chalk.red('✖ ERROR   finished (1.10s)'));
		});

		test.each(['success', 'warn', 'raw'])('%s is not called', method => {
			expect(writer[method]).not.toHaveBeenCalled();
		});
	});

	describe('successful run without steps', () => {
		beforeEach(() => {
			fakeClock.tick(75000);
			logger.end();
		});

		test('print a formatted success message for group closure', () => {
			expect(writer.success).toHaveBeenNthCalledWith(1, chalk.green('✔ SUCCESS group (1.25m)'));
		});

		test.each(['error', 'warn', 'raw', 'info'])('%s is not called', method => {
			expect(writer[method]).not.toHaveBeenCalled();
		});
	});

	describe('successful run with group', () => {
		beforeEach(() => {
			const nestedLogger = logger.group('group 1');
			fakeClock.tick(125);
			nestedLogger.step('nested 1');
			fakeClock.tick(125);
			nestedLogger.step('nested 2');
			fakeClock.tick(125);
			const subNestedLogger = nestedLogger.group('group 2');
			fakeClock.tick(125);
			subNestedLogger.step('sub nested 1');
			fakeClock.tick(125);
			subNestedLogger.step('sub nested 2');
			fakeClock.tick(125);
			subNestedLogger.end();
			nestedLogger.step('nested 3');
			fakeClock.tick(125);
			nestedLogger.end();
			fakeClock.tick(125);
			logger.step('step 1');
			fakeClock.tick(125);
			logger.end();
		});

		test('1st, print a formatted info message for group 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(1, chalk.blue('  ℹ INFO    group 1'));
		});

		test('2nd, print a formatted info message for nested 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(2, chalk.blue('    ℹ INFO    nested 1'));
		});

		test('3rd, print a formatted success message for nested 1', () => {
			expect(writer.success).toHaveBeenNthCalledWith(1, chalk.green('    ✔ SUCCESS nested 1 (125.00ms)'));
		});

		test('4th, print a formatted info message for nested 2', () => {
			expect(writer.info).toHaveBeenNthCalledWith(3, chalk.blue('    ℹ INFO    nested 2'));
		});

		test('5th, print a formatted success message for nested 2', () => {
			expect(writer.success).toHaveBeenNthCalledWith(2, chalk.green('    ✔ SUCCESS nested 2 (125.00ms)'));
		});

		test('6th, print a formatted info message for group 2', () => {
			expect(writer.info).toHaveBeenNthCalledWith(4, chalk.blue('    ℹ INFO    group 2'));
		});

		test('7th, print a formatted info message for sub nested 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(5, chalk.blue('      ℹ INFO    sub nested 1'));
		});

		test('8th, print a formatted success message for sub nested 1', () => {
			expect(writer.success).toHaveBeenNthCalledWith(3, chalk.green('      ✔ SUCCESS sub nested 1 (125.00ms)'));
		});

		test('9th, print a formatted info message for sub nested 2', () => {
			expect(writer.info).toHaveBeenNthCalledWith(6, chalk.blue('      ℹ INFO    sub nested 2'));
		});

		test('10th, print a formatted success message for sub nested 2', () => {
			expect(writer.success).toHaveBeenNthCalledWith(4, chalk.green('      ✔ SUCCESS sub nested 2 (125.00ms)'));
		});

		test('11th, print a formatted success message for group 2 closure', () => {
			expect(writer.success).toHaveBeenNthCalledWith(5, chalk.green('    ✔ SUCCESS group 2 (375.00ms)'));
		});

		test('12th, print a formatted info message for nested 3', () => {
			expect(writer.info).toHaveBeenNthCalledWith(7, chalk.blue('    ℹ INFO    nested 3'));
		});

		test('13th, print a formatted success message for nested 3', () => {
			expect(writer.success).toHaveBeenNthCalledWith(6, chalk.green('    ✔ SUCCESS nested 3 (125.00ms)'));
		});

		test('14th, print a formatted success message for group 1 closure', () => {
			expect(writer.success).toHaveBeenNthCalledWith(7, chalk.green('  ✔ SUCCESS group 1 (875.00ms)'));
		});

		test('15th, print a formatted info message for step 1', () => {
			expect(writer.info).toHaveBeenNthCalledWith(8, chalk.blue('  ℹ INFO    step 1'));
		});

		test('16nd, print a formatted success message for step 1', () => {
			expect(writer.success).toHaveBeenNthCalledWith(8, chalk.green('  ✔ SUCCESS step 1 (125.00ms)'));
		});

		test('17th, print a formatted success message for group closure', () => {
			expect(writer.success).toHaveBeenNthCalledWith(9, chalk.green('✔ SUCCESS group (1.13s)'));
		});
	});

	describe('invalid run', () => {
		test('call "stepError" before "step"', () => {
			expect(() => logger.stepError('step 1')).toThrow(ObLoggerNoActiveStepError);
		});

		test('call "stepError" after "end"', () => {
			logger.end();
			expect(() => logger.stepError('step 1')).toThrow(ObLoggerInactiveGroupError);
		});

		test('call "step" after "end"', () => {
			logger.end();
			expect(() => logger.step('step 1')).toThrow(ObLoggerInactiveGroupError);
		});

		test('call "group" after "end"', () => {
			logger.end();
			expect(() => logger.group('step 1')).toThrow(ObLoggerInactiveGroupError);
		});

		test('call "end" after "end"', () => {
			logger.end();
			expect(() => logger.end('step 1')).toThrow(ObLoggerInactiveGroupError);
		});
	});
});
