import {ObExecError} from './ob-exec-error';
import {ObSpawnExitError} from './ob-spawn-exit-error';

describe(ObSpawnExitError.name, () => {
	let error: ObExecError;
	beforeEach(() => {
		error = new ObSpawnExitError(1, 'process errored');
	});

	test.each([{instance: Error}, {instance: ObExecError}, {instance: ObSpawnExitError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObSpawnExitError" name', () => {
		expect(error.name).toBe('ObSpawnExitError');
	});

	test('has correct message', () => {
		expect(error.message).toBe('ObExecError - Command failed with exit code "1":\nprocess errored');
	});
});
