import {BaseLogger} from './base-logger.js';
import type {ObGroupLogger, ObLogger} from './logger.types.js';
import {GroupLogger} from './group-logger.js';

export class Logger extends BaseLogger implements ObLogger {
	override group(message: string): ObGroupLogger {
		this.info(message);
		return new GroupLogger(this.writer, {indentation: 1, parent: this, group: message});
	}
}
