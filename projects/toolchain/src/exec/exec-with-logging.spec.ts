// execSync needs to be mocked before it imported. since any other import statement may also import execSync, the mock
// need to be the first thing in this file

jest.mock('child_process', () => ({
	execSync: jest.fn(),
}));

import {execSync} from 'child_process';
import {type ObGroupLogger, type ObLogger, obCreateLogger} from '../logger';
import {obExecWithLogging, obExecWithLoggingOrExit} from './exec-with-logging';

describe('exec-with-logging', () => {
	let logger: ObLogger;
	let loggerGroup: ObGroupLogger;
	let result: string;
	const command = 'my-command';

	beforeEach(() => {
		logger = obCreateLogger(true);
		loggerGroup = logger.group('command');
		jest.spyOn(loggerGroup, 'step').mockImplementation(() => {});
		jest.spyOn(loggerGroup, 'logRawOutput').mockImplementation(() => {});
		jest.spyOn(loggerGroup, 'stepError').mockImplementation(() => {});
		jest.spyOn(process, 'exit').mockImplementation((() => {}) as unknown as (code?: number) => never);
	});

	describe.each([{cmd: obExecWithLogging}, {cmd: obExecWithLoggingOrExit}])('$cmd.name success', ({cmd}) => {
		beforeEach(() => {
			(execSync as jest.Mock).mockReturnValueOnce('hello');

			result = cmd(loggerGroup, command);
		});

		test('logs the step', () => {
			expect(loggerGroup.step).toHaveBeenCalledWith(`Execute: ${command}`);
		});

		test('logs the command output', () => {
			expect(loggerGroup.logRawOutput).toHaveBeenCalledWith('hello');
		});

		test('returns the command output', () => {
			expect(result).toBe('hello');
		});
	});

	describe.each([
		{cmd: obExecWithLogging, exit: false},
		{cmd: obExecWithLoggingOrExit, exit: true},
	])('$cmd.name failing', ({cmd, exit}) => {
		describe.each([
			{
				desc: 'stderr',
				throws: {
					stderr: 'something went wrong',
					stdout: undefined,
				},
				error: 'something went wrong (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'stdout',
				throws: {
					stderr: undefined,
					stdout: 'something went wrong',
				},
				error: 'something went wrong (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'invalid stderr & stdout',
				throws: {
					stderr: undefined,
					stdout: undefined,
				},
				error: '{} (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'Error with stack',
				throws: getErrorWithLimitedStack(),
				error: 'Error: boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'Error without stack',
				throws: getErrorWithoutStack(),
				error: 'boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'Error with numeric status',
				throws: {status: 42, stdout: 'boom'},
				error: 'boom (status: 42)',
				exitCode: 42,
			},
			{
				desc: 'Error with non-numeric status',
				throws: {status: '42', stdout: 'boom'},
				error: 'boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'Error with signal',
				throws: {signal: 'SIGKILL', stdout: 'boom'},
				error: 'boom (status: 137)',
				exitCode: 137,
			},
			{
				desc: 'Error with invalid signal',
				throws: {signal: true, stdout: 'boom'},
				error: 'boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'Error with unknown signal',
				throws: {signal: 'signal', stdout: 'boom'},
				error: 'boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'string',
				throws: 'boom',
				error: 'boom (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'number',
				throws: 42,
				error: '42 (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'boolean',
				throws: false,
				error: 'false (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'object',
				throws: {error: true},
				error: '{"error":true} (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'object',
				throws: getNonSerializableError(),
				error: 'Unknown error (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'array',
				throws: ['error'],
				error: '["error"] (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'null',
				throws: null,
				error: 'Unknown error (status: 1)',
				exitCode: 1,
			},
			{
				desc: 'undefined',
				throws: undefined,
				error: 'Unknown error (status: 1)',
				exitCode: 1,
			},
		])('with $desc', ({throws, error, exitCode}) => {
			beforeEach(() => {
				(execSync as jest.Mock).mockImplementationOnce(() => {
					throw throws;
				});
				result = cmd(loggerGroup, command);
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			test('logs the step', () => {
				expect(loggerGroup.step).toHaveBeenCalledWith(`Execute: ${command}`);
			});

			test('logs the error output', () => {
				expect(loggerGroup.logRawOutput).toHaveBeenCalledWith(error);
			});

			test('logs the step error', () => {
				expect(loggerGroup.stepError).toHaveBeenCalled();
			});

			test('returns undefined', () => {
				expect(result).toBeUndefined();
			});

			test(`do ${exit ? '' : 'not'} exit`, () => {
				if (exit) {
					expect(process.exit).toHaveBeenCalledWith(exitCode);
				} else {
					expect(process.exit).not.toHaveBeenCalled();
				}
			});
		});
	});
});

/**
 * This keeps only the 1st line of the stack because other lines are platform and user dependent, making them impossible to test
 */
function getErrorWithLimitedStack(): Error {
	const error = new Error('boom');
	error.stack = error.stack.split('\n')[0];
	return error;
}

function getErrorWithoutStack(): Error {
	const error = new Error('boom');
	error.stack = undefined;
	return error;
}

function getNonSerializableError(): Record<string, unknown> {
	const error = {self: null};
	error.self = error;
	return error;
}
