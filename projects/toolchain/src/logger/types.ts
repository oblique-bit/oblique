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
