import process from 'process';
import {camelToKebabCase, executeCommandWithLog} from './utils';
import {StaticScript} from './static-script';

export class Lint extends StaticScript {
	private hasFix: boolean;

	static initialize(hasFix: boolean): Lint {
		Lint.instance = new Lint();
		(Lint.instance as Lint).hasFix = hasFix;
		return Lint.instance as Lint;
	}

	/**
	 * The `wd` param (that stands for `working directory`) is used to eventually change the working directory of the script execution.
	 * This is needed in order to migrate to the current code base to the new ESLint flat config format.
	 */
	esLint(files: string | string[], wd?: string): Lint {
		// Saving the current working directory in order to restore it after the execution
		const cwd = process.cwd();
		// Eventually change the working directory
		if (wd) {
			process.chdir(wd);
		}
		Lint.executeCommand('eslint', files, {
			cache: true,
			fix: this.hasFix
		});
		// Eventually restore the working directory
		if (wd) {
			process.chdir(cwd);
		}
		return Lint.instance as Lint;
	}

	styleLint(files: string | string[]): Lint {
		Lint.executeCommand('stylelint', files, {
			cache: true,
			allowEmptyInput: true,
			fix: this.hasFix
		});
		return Lint.instance as Lint;
	}

	prettier(files: string | string[]): Lint {
		Lint.executeCommand('prettier', files, {
			cache: true,
			cacheLocation: '.prettiercache',
			logLevel: 'warn',
			write: this.hasFix,
			check: !this.hasFix
		});
		return Lint.instance as Lint;
	}

	finalize(): void {
		Lint.instance = undefined;
	}

	private static executeCommand(commandName: string, files: string | string[], options?: Record<string, string | boolean>): void {
		const command = this.buildCommand(commandName, Array.isArray(files) ? files : [files], options);
		executeCommandWithLog(command, `Lint with ${commandName}`);
	}

	private static buildCommand(command: string, files: string[], options?: Record<string, string | boolean>): string {
		return Object.keys(options || {})
			.filter(key => !!options[key])
			.map(key => ({key: `--${camelToKebabCase(key)}`, value: options[key]}))
			.map(({key, value}) => (value === true ? key : `${key}=${value}`))
			.reduce((parts, option) => [...parts, option], [command, ...files.map(glob => `"${glob}"`)])
			.join(' ');
	}
}
