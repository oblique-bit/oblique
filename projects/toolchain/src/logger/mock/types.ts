import type {ObGroupLogger, ObLogger} from '../logger.types';

/**
 * Represents a fully mocked logger environment for testing.
 *
 * Provides:
 * - A top-level mocked {@link ObLogger}.
 * - An array of mocked {@link ObGroupLogger} instances created via {@link ObLogger#group|ObLogger.group()}
 *   and {@link ObGroupLogger#group|ObGroupLogger.group()}, ordered by creation time (earliest first).
 * - A function to reset groups between tests.
 */
export interface ObMockLogger {
	/**
	 * A fully mocked {@link ObLogger} instance.
	 *
	 * All methods are Jest mocks and do not produce real output.
	 * The {@link ObLogger#group|ObLogger.group()} method returns a mocked {@link ObGroupLogger}
	 * that is stored in {@link ObMockLogger#loggerGroups|loggerGroups}.
	 */
	logger: jest.Mocked<ObLogger>;

	/**
	 * An array of fully mocked {@link ObGroupLogger} instances.
	 *
	 * Each instance represents a group created by a call to {@link ObLogger#group|ObLogger.group()}
	 * or {@link ObGroupLogger#group|ObGroupLogger.group()} on the logger or any of its descendant groups.
	 * Instances are stored in order of creation: `loggerGroups[0]` is the first group created.
	 */
	loggerGroups: jest.Mocked<ObGroupLogger>[];

	/**
	 * Typically called after each test to clear the existing groups and avoid interference from previous tests.
	 *
	 * Note: Neither `jest.resetAllMocks()` nor `jest.clearAllMocks()` will reset the {@link ObMockLogger#loggerGroups|loggerGroups} array.
	 * This function was created to handle that specific case.
	 *
	 * @example
	 * afterEach(() => {
	 *   clearGroups();        // resets the {@link ObMockLogger#loggerGroups|loggerGroups} array
	 *   jest.clearAllMocks(); // resets all Jest mocks
	 * });
	 */
	clearGroups: () => void;
}
