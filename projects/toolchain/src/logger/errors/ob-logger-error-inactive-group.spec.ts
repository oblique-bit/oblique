import {ObLoggerError} from './ob-logger-error';
import {ObLoggerInactiveGroupError} from './ob-logger-error-inactive-group';

describe(ObLoggerInactiveGroupError.name, () => {
	let error: ObLoggerError;
	beforeEach(() => {
		error = new ObLoggerInactiveGroupError('step');
	});

	test.each([{instance: Error}, {instance: ObLoggerError}, {instance: ObLoggerInactiveGroupError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObLoggerInactiveGroupError" name', () => {
		expect(error.name).toBe('ObLoggerInactiveGroupError');
	});

	test('has correct message', () => {
		expect(error.message).toBe('ObLoggerError - Cannot call "step" after calling "end"');
	});
});
