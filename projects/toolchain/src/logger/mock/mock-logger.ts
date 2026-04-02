import * as loggerModule from '../';
import type {ObGroupLogger, ObLogger} from '../';
import type {ObMockLogger} from './types';

jest.mock('../'); // mock the logger tool

const loggerGroups: jest.Mocked<ObGroupLogger>[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function -- signature must match the real implementation
const voidFn = (message: string): void => {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature must match the real implementation
const groupFn = (message: string): ObGroupLogger => createMockLoggerGroup();

const logger: jest.Mocked<ObLogger> = {
	info: jest.fn(voidFn),
	success: jest.fn(voidFn),
	warn: jest.fn(voidFn),
	error: jest.fn(voidFn),
	raw: jest.fn(voidFn),
	group: jest.fn(groupFn),
};

function clearGroups(): void {
	loggerGroups.length = 0;
}

function createMockLoggerGroup(): jest.Mocked<ObGroupLogger> {
	const group = {
		info: jest.fn(voidFn),
		success: jest.fn(voidFn),
		warn: jest.fn(voidFn),
		error: jest.fn(voidFn),
		raw: jest.fn(voidFn),
		step: jest.fn(),
		stepError: jest.fn(),
		logRawOutput: jest.fn(),
		end: jest.fn(),
		group: jest.fn(groupFn),
	};
	loggerGroups.push(group);
	return group;
}

/**
 * Factory function to create a fully mocked logger environment.
 *
 * @example
 * // Unit under test calls:
 * const group = obCreateLogger().group('Start group');
 * const nestedGroup = group.group('Nested group');
 * nestedGroup.end();
 * group.end();
 *
 * // Test the logger with:
 * import {obMockLogger} from '@oblique/toolchain/logger/mock';
 * ...
 * const {logger, loggerGroups, clearGroups} = obMockLogger();
 * ...
 * afterEach(() => {
 *   clearGroups();
 * });
 *
 * test('logging', () => {
 *   expect(logger.group).toHaveBeenCalled();
 *   expect(loggerGroups[0].group).toHaveBeenCalled();
 *   expect(loggerGroups[1].end).toHaveBeenCalled();
 *   expect(loggerGroups[0].end).toHaveBeenCalled();
 * });
 *
 * @returns A {@link ObMockLogger} object containing:
 * - {@link ObMockLogger#logger|logger}: the top-level mocked logger
 * - {@link ObMockLogger#loggerGroups|loggerGroups}: all mocked logger groups created by the top-level logger or any of its descendant groups
 * - {@link ObMockLogger#clearGroups|clearGroups()}: a function to clear {@link ObMockLogger#loggerGroups|loggerGroups} between tests
 */
export function obMockLogger(): ObMockLogger {
	const mockedModule = jest.mocked(loggerModule);
	mockedModule.obCreateSchematicsLogger.mockImplementation(() => logger);
	mockedModule.obCreateLogger.mockImplementation(() => logger);

	return {logger, loggerGroups, clearGroups};
}
