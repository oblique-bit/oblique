import type {LogLevel, LoggerOptions, MethodKeys, Writer} from './types';
import {BaseLogger} from './base-logger';
import type {ObGroupLogger, ObLogger} from './logger.types';
import {ObLoggerInactiveGroupError} from './errors/ob-logger-error-inactive-group';
import {ObLoggerNoActiveStepError} from './errors/ob-logger-error-no-active-step';

export class GroupLogger extends BaseLogger implements ObGroupLogger {
	private static readonly millisecondsPerSecond = 1000;
	private static readonly millisecondsPerMinute = 60000;
	private static readonly timePrecision = 2;
	private readonly indentation: number;
	private readonly parent: ObLogger;
	private readonly groupMessage: string;
	private readonly groupStartTime: number;
	private stepMessage: string | undefined;
	private stepStartTime: number | undefined;
	private hasError = false;
	private isGroupInactive = false;

	constructor(writer: Writer, options: LoggerOptions) {
		super(writer);
		this.indentation = options.indentation;
		this.parent = options.parent;
		this.groupMessage = options.group;
		this.groupStartTime = performance.now();
	}

	group(message: string): ObGroupLogger {
		this.validateActiveGroup('group');
		if (this.stepMessage) {
			this.stepSuccess(this.stepMessage);
		}
		this.info(message);
		return new GroupLogger(this.writer, {indentation: this.indentation + 1, parent: this, group: message});
	}

	step(message: string): void {
		this.validateActiveGroup('step');
		if (this.stepMessage) {
			this.stepSuccess(this.stepMessage);
		}
		this.info(message);
		this.stepMessage = message;
		this.stepStartTime = performance.now();
	}

	stepError(message?: string): void {
		this.validateActiveGroup('stepError');
		const activeMessage = this.getStepMessage('stepError');
		this.error(message ?? activeMessage);
		this.stepMessage = undefined;
		this.stepStartTime = undefined;
		this.hasError = true;
	}

	end(message = this.groupMessage): void {
		this.validateActiveGroup('end');
		if (this.stepMessage) {
			this.success(this.stepMessage);
		}
		const msg = `${message} (${this.formatDuration(performance.now() - this.groupStartTime)})`;
		if (this.hasError) {
			this.parent.error(msg);
		} else {
			this.parent.success(msg);
		}
		this.isGroupInactive = true;
	}

	protected override formatMessage(level: LogLevel, message: string): string {
		const {symbol, label, color} = this.getLevelInfo(level);
		const messageParts = [symbol, label, message];
		if (this.stepStartTime !== undefined) {
			messageParts.push(`(${this.formatDuration(performance.now() - this.stepStartTime)})`);
		}
		return color(this.indent() + messageParts.join(' '));
	}

	private indent(indentation = this.indentation): string {
		return '  '.repeat(indentation);
	}

	private stepSuccess(message: string): void {
		this.success(message);
		this.stepMessage = undefined;
		this.stepStartTime = undefined;
	}

	private formatDuration(time: number): string {
		if (time < GroupLogger.millisecondsPerSecond) {
			return `${this.formatTime(time)}ms`;
		}
		if (time < GroupLogger.millisecondsPerMinute) {
			return `${this.formatTime(time / GroupLogger.millisecondsPerSecond)}s`;
		}
		return `${this.formatTime(time / GroupLogger.millisecondsPerMinute)}m`;
	}

	private formatTime(time: number): string {
		return time.toFixed(GroupLogger.timePrecision);
	}

	private validateActiveGroup(methodName: MethodKeys<GroupLogger>): void {
		if (this.isGroupInactive) {
			throw new ObLoggerInactiveGroupError(methodName);
		}
	}

	private getStepMessage(methodName: MethodKeys<GroupLogger>): string {
		if (!this.stepMessage) {
			throw new ObLoggerNoActiveStepError(methodName);
		}

		return this.stepMessage;
	}
}
