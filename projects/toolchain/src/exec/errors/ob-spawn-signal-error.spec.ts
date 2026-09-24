import {ObExecError} from './ob-exec-error';
import {ObSpawnSignalError} from './ob-spawn-signal-error';

describe(ObSpawnSignalError.name, () => {
	let error: ObExecError;
	beforeEach(() => {
		error = new ObSpawnSignalError('SIGKILL');
	});

	test.each([{instance: Error}, {instance: ObExecError}, {instance: ObSpawnSignalError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObSpawnSignalError" name', () => {
		expect(error.name).toBe('ObSpawnSignalError');
	});

	test('has correct message', () => {
		expect(error.message).toBe('ObExecError - Process was terminated by "SIGKILL" signal');
	});
});
