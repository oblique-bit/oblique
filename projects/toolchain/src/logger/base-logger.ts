import type {LogLevel, Writer} from './types';
import type {ObGroupLogger, ObLogger} from './logger.types';
import chalk, {type Chalk} from 'chalk';

export abstract class BaseLogger implements ObLogger {
	protected readonly writer: Writer;
	private static readonly logLevels = {
		info: {symbol: 'ℹ', label: 'INFO', color: chalk.blue},
		success: {symbol: '✔', label: 'SUCCESS', color: chalk.green},
		warn: {symbol: '⚠', label: 'WARN', color: chalk.yellow},
		error: {symbol: '✖', label: 'ERROR', color: chalk.red},
	} as const;
	private static readonly padLength = Math.max(
		...Object.values(BaseLogger.logLevels).map(logLevel => logLevel.label.length)
	);

	constructor(writer: Writer) {
		this.writer = writer;
	}

	info(message: string): void {
		this.writer.info(this.formatMessage('info', message));
	}

	success(message: string): void {
		this.writer.success(this.formatMessage('success', message));
	}

	warn(message: string): void {
		this.writer.warn(this.formatMessage('warn', message));
	}

	error(message: string): void {
		this.writer.error(this.formatMessage('error', message));
	}

	raw(message: string): void {
		this.writer.raw(message);
	}

	abstract group(message: string): ObGroupLogger;

	protected formatMessage(level: LogLevel, message: string): string {
		const {symbol, label, color} = this.getLevelInfo(level);
		const messageParts = [symbol, label.padEnd(BaseLogger.padLength), message];
		return color(messageParts.join(' '));
	}

	protected getLevelInfo(level: LogLevel): {symbol: string; label: string; color: Chalk} {
		const {symbol, label, color} = BaseLogger.logLevels[level];
		return {
			symbol,
			label: label.padEnd(BaseLogger.padLength),
			color,
		};
	}
}
