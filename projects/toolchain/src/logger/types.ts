import type {ObLogger} from './logger.types';

export type LogLevel = 'info' | 'success' | 'warn' | 'error';

export interface Writer {
	info: (message: string) => void;
	success: (message: string) => void;
	warn: (message: string) => void;
	error: (message: string) => void;
	raw: (message: string) => void;
}

export interface LoggerOptions {
	indentation: number;
	parent: ObLogger;
	group: string;
}

/**
 * This type extracts the keys of T whose values are functions
 *
 * [K in keyof T]
 * Iterate over every property key K of T
 *
 * T[K] extends (...args: any[]) => any
 * Check if the property type is a function
 *
 * [K in keyof T]: T[K] extends (...args: any[]) => any
 * Create a mapped boolean type where each property of T is evaluated
 * according to whether its value type is a function
 *
 * [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
 * Map each property to its own key if it is a function, otherwise to never
 *
 * {...}[keyof T]
 * Extract the union of all property values from the mapped type
 * ("never" disappears from unions, leaving only the function keys)
 */
export type MethodKeys<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- unknown is too strict and match only functions that have parameters and return something
	[K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];
