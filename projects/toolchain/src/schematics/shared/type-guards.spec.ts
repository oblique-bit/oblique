import {isOptionalString, isOptionalStringMap, isPlainObject, isString, isStringMap} from './type-guards';

describe('type-guards', () => {
	describe(isString.name, () => {
		test.each(['', 'string'])(`Valid input (%s)`, input => {
			expect(isString(input)).toBe(true);
		});

		test.each([null, undefined, true, 42, NaN, {}, []])(`Invalid input (%s)`, input => {
			expect(isString(input)).toBe(false);
		});
	});

	describe(isOptionalString.name, () => {
		test.each(['', 'string', null, undefined])(`Valid input (%s)`, input => {
			expect(isOptionalString(input)).toBe(true);
		});

		test.each([true, 42, NaN, {}, []])(`Invalid input (%s)`, input => {
			expect(isOptionalString(input)).toBe(false);
		});
	});

	describe(isStringMap.name, () => {
		test.each([{}, {string: 'bar'}])(`Valid input (%s)`, input => {
			expect(isStringMap(input)).toBe(true);
		});

		test.each(['string', true, 42, null, undefined, NaN, {boolean: true}, {number: 43}, {null: null}])(
			`Invalid input (%s)`,
			input => {
				expect(isStringMap(input)).toBe(false);
			}
		);
	});

	describe(isOptionalStringMap.name, () => {
		test.each([{}, {string: 'bar'}, null, undefined])(`Valid input (%s)`, input => {
			expect(isOptionalStringMap(input)).toBe(true);
		});

		test.each(['string', true, 42, NaN, {boolean: true}, {number: 43}, {null: null}])(`Invalid input (%s)`, input => {
			expect(isOptionalStringMap(input)).toBe(false);
		});
	});

	describe(isPlainObject.name, () => {
		test.each([{}, {string: 'bar'}, {parent: {child: ''}}])(`Valid input (%s)`, input => {
			expect(isPlainObject(input)).toBe(true);
		});

		test.each(['string', true, 42, NaN, null, undefined, []])(`Invalid input (%s)`, input => {
			expect(isPlainObject(input)).toBe(false);
		});
	});
});
