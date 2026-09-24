import {ObFileNotFoundError} from './file-not-found-error';
import {ObSchematicsError} from './schematics-error';

describe(ObFileNotFoundError.name, () => {
	let error: ObFileNotFoundError;
	beforeEach(() => {
		error = new ObFileNotFoundError('file.txt');
	});

	test.each([{instance: Error}, {instance: ObFileNotFoundError}, {instance: ObSchematicsError}])(
		`instance of $instance.name`,
		({instance}) => {
			expect(error).toBeInstanceOf(instance);
		}
	);

	test('has "ObFileNotFoundError" name', () => {
		expect(error.name).toBe('ObFileNotFoundError');
	});

	test('has correct message', () => {
		expect(error.message).toBe('ObSchematicsError - Path "file.txt" does not exist');
	});
});
