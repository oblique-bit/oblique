import {camelToKebabCase, executeCommandWithLog} from './utils';
import {StaticScript} from './static-script';

export class Lint extends StaticScript {
	private hasFix: boolean;

	static initialize(hasFix: boolean): Lint {
		Lint.instance = new Lint();
		(Lint.instance as Lint).hasFix = hasFix;
		return Lint.instance as Lint;
	}

	esLint(files: string | string[], config?: string): Lint {
		Lint.executeCommand('eslint', files, {
			config,
			cache: true,
			fix: this.hasFix
		});
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
