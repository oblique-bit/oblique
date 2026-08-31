import type {SpawnSyncOptionsWithStringEncoding} from 'child_process';
import type {ObGroupLogger} from '../logger/index.js';

export type ObExecOptions = ObExecOptionsFatal | ObExecOptionsNonFatal;

export type ObExecOptionsFatal = ObExecParams & {
	isFatal: true;
};

export type ObExecOptionsNonFatal = ObExecParams & {
	isFatal: false;
};

export interface ObExecParams {
	logger: ObGroupLogger;
	command: string;
	args?: string[];
	options?: SpawnSyncOptionsWithStringEncoding;
}
