import type {ExecSyncOptionsWithStringEncoding} from 'child_process';
import type {ObGroupLogger} from '../logger';

export type ObExecOptions = ObExecOptionsFatal | ObExecOptionsNonFatal;

export interface ObExecOptionsFatal {
	logger: ObGroupLogger;
	command: string;
	isFatal: true;
	options?: ExecSyncOptionsWithStringEncoding;
}

export interface ObExecOptionsNonFatal {
	logger: ObGroupLogger;
	command: string;
	isFatal: false;
	options?: ExecSyncOptionsWithStringEncoding;
}
