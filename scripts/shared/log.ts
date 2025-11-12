import chalk, {Chalk} from 'chalk';
import {StaticScript} from './static-script';
import {Timer} from './timer';

type LogPrefix = 'info' | 'success' | 'error';

export class Log extends StaticScript {
	private static primaryTask: string;
	private static task: string;
	private static readonly indent = '\t';
	private static readonly primaryTimer = 'primary';
	private static readonly taskTimer = 'task';
	private static readonly prefixes: Record<LogPrefix, {icon: string; text: string; color: Chalk}> = {
		info: {
			icon: 'ℹ',
			text: 'started',
			color: chalk.blue,
		},
		success: {
			icon: '✔',
			text: 'completed',
			color: chalk.green,
		},
		error: {
			icon: '✘',
			text: 'error',
			color: chalk.red,
		},
	};
	private static readonly padLength = Math.max(...Object.values(Log.prefixes).map(prefix => prefix.text.length));

	static start(message: string): void {
		Timer.startTimer(Log.primaryTimer);
		if (Log.primaryTask) {
			Log.fatal(
				`The "start" method may only be called once per script. It has already been called with "${Log.primaryTask}" and is called again with ${message}.`
			);
		}
		Log.primaryTask = message;
		Log.write('info', message);
		Timer.startTimer(Log.taskTimer);
	}

	static info(message: string): void {
		Log.validate('info');
		Log.completePreviousTask();
		Timer.startTimer(Log.taskTimer);
		Log.task = message;
		Log.write('info', `${Log.indent}${Log.task}`);
	}

	static success(message?: string): void {
		Log.validate('success');
		Log.completePreviousTask();
		Log.write('success', `${Log.primaryTask} (${Timer.getTimerTime(Log.primaryTimer)})`);
		Log.primaryTask = undefined;
		Log.task = undefined;
		if (message) {
			console.log(message);
		}
	}

	static error(message: string): void {
		Log.validate('error');
		Log.write('error', Log.task ? `${Log.indent}${Log.task}` : Log.primaryTask);
		console.log(message);
		Log.primaryTask = undefined;
		Log.task = undefined;
	}

	private static fatal(title: string): void {
		Log.write('error', `Fatal error with Logging: ${title}`);
		console.log('Scripts should start with a call to "Log.start" and end with a call to "Log.success".');
		console.log('Each sub-task is then logged with a call to "Log.info".\n');
		process.exit(-1);
	}

	private static validate(caller: string): void {
		if (!Log.primaryTask) {
			Log.fatal(`The "start" method needs to be called before calling "${caller}".`);
		}
	}

	private static completePreviousTask(): void {
		if (Log.task) {
			Log.write('success', `${Log.indent}${Log.task} (${Timer.getTimerTime(Log.taskTimer)})`);
		}
	}

	private static write(prefix: LogPrefix, text: string): void {
		const prefixDetails = Log.prefixes[prefix];
		console.log(prefixDetails.color(`${prefixDetails.icon} [${prefixDetails.text.padEnd(Log.padLength)}] ${text}`));
	}
}
