import {ObSchematicsError} from './schematics-error';
import {ObInvalidJsonError} from './invalid-json';

describe(ObInvalidJsonError.name, () => {
	describe.each([undefined, 'hello world'])('with "%s" as error message', errorMessage => {
		let error: ObInvalidJsonError;

		beforeEach(() => {
			error = new ObInvalidJsonError('file.txt', errorMessage);
		});

		test.each([{instance: Error}, {instance: ObInvalidJsonError}, {instance: ObSchematicsError}])(
			`instance of $instance.name`,
			({instance}) => {
				expect(error).toBeInstanceOf(instance);
			}
		);

		test('has "ObInvalidJsonError" name', () => {
			expect(error.name).toBe('ObInvalidJsonError');
		});

		test('has correct message', () => {
			expect(error.message).toBe(
				errorMessage
					? `ObSchematicsError - ${errorMessage}`
					: 'ObSchematicsError - Failed to parse "file.txt" as JSON. Object expected at offset: 0'
			);
		});
	});
});
