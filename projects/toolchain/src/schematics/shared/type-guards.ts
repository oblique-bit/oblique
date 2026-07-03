export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isOptionalString(value: unknown): value is string | undefined {
	return value === undefined || value === null || isString(value);
}

export function isStringMap(value: unknown): value is Record<string, string> {
	return isPlainObject(value) && Object.values(value).every(val => isString(val));
}

export function isOptionalStringMap(value: unknown): value is Record<string, string> | undefined {
	return value === undefined || value === null || isStringMap(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
