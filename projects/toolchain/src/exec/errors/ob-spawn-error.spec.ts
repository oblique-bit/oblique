import {ObExecError} from './ob-exec-error';
import {ObSpawnError} from './ob-spawn-error';

describe(ObSpawnError.name, () => {
	let error: ObExecError;
	beforeEach(() => {
		error = new ObSpawnError('npm install', "Can't spawn");
	});

	test.each([{instance: Error}, {instance: ObExecError}, {instance: ObSpawnError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObSpawnError" name', () => {
		expect(error.name).toBe('ObSpawnError');
	});

	test('has correct message', () => {
		expect(error.message).toBe("ObExecError - Failed to execute 'npm install': Can't spawn");
	});
});
