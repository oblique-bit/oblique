/**
 * Checks whether a value is a string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string; otherwise, `false`.
 */
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/**
 * Checks whether a value is a string or is not provided.
 *
 * `null` is treated as an optional value and therefore also returns `true`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string, `undefined`, or `null`; otherwise, `false`.
 */
export function isOptionalString(value: unknown): value is string | undefined {
	return value === undefined || value === null || isString(value);
}

/**
 * Checks whether a value is a plain object whose property values are all strings.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a map of strings; otherwise, `false`.
 */
export function isStringMap(value: unknown): value is Record<string, string> {
	return isPlainObject(value) && Object.values(value).every(val => isString(val));
}

/**
 * Checks whether a value is a plain object whose property values are all strings or is not provided.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a map of strings, `undefined`, or `null`; otherwise, `false`.
 */
export function isOptionalStringMap(value: unknown): value is Record<string, string> | undefined {
	return value === undefined || value === null || isStringMap(value);
}

/**
 * Checks whether a value is a plain object.
 *
 * A plain object is a non-`null`, non-array object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a plain object; otherwise, `false`.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
