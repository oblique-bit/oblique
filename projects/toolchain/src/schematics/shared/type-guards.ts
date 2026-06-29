import {type JsonValue, isJsonObject} from '@angular-devkit/core';

export function isString(value: JsonValue): value is string {
	return typeof value === 'string';
}

export function isOptionalString(value: JsonValue | undefined): value is string | undefined {
	return value === undefined || value === null || isString(value);
}

export function isStringMap(value: JsonValue): value is Record<string, string> {
	return isJsonObject(value) && Object.values(value).every(val => isString(val));
}

export function isOptionalStringMap(value: JsonValue | undefined): value is Record<string, string> | undefined {
	return value === undefined || value === null || isStringMap(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
