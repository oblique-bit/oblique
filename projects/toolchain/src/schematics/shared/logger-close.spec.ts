import type {Rule} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../logger';
import {closeLogger} from './logger-close';

describe('closeLogger', () => {
	let mockLogger: jest.Mocked<ObGroupLogger>;

	beforeEach(() => {
		mockLogger = {
			end: jest.fn(),
		} as unknown as jest.Mocked<ObGroupLogger>;
	});

	it('should call end on the logger', async () => {
		const rule: Rule = closeLogger(mockLogger);

		await rule(undefined, undefined);

		expect(mockLogger.end).toHaveBeenCalledTimes(1);
	});
});
