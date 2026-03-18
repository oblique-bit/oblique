import {ObLoggerError} from './ob-logger-error';
import {ObLoggerNoActiveStepError} from './ob-logger-error-no-active-step';

describe(ObLoggerNoActiveStepError.name, () => {
	let error: ObLoggerError;
	beforeEach(() => {
		error = new ObLoggerNoActiveStepError('step');
	});

	test.each([{instance: Error}, {instance: ObLoggerError}, {instance: ObLoggerNoActiveStepError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObLoggerNoActiveStepError" name', () => {
		expect(error.name).toBe('ObLoggerNoActiveStepError');
	});

	test('has correct message', () => {
		expect(error.message).toBe('ObLoggerError - Cannot call "step" before calling "step"');
	});
});
