import {camelToKebabCase, executeCommand} from './utils';

export class Lint {
	private static instance: Lint;
	private hasFix: boolean;

	// the constructor needs to be private to impede the class instantiation
	private constructor() {
		if (Lint.instance) {
			throw new Error('The "finalize" method needs to be called before calling "initialize" again.');
		}
	}

	static initialize(hasFix: boolean): Lint {
		Lint.instance = new Lint();
		Lint.instance.hasFix = hasFix;
		return Lint.instance;
	}

	esLint(files: string | string[], config?: string): Lint {
		Lint.executeCommand('eslint', files, {
			config,
			cache: true,
			fix: this.hasFix
		});
		return Lint.instance;
	}

	styleLint(files: string | string[]): Lint {
		Lint.executeCommand('stylelint', files, {
			cache: true,
			allowEmptyInput: true,
			fix: this.hasFix
		});
		return Lint.instance;
	}

	prettier(files: string | string[]): Lint {
		Lint.executeCommand('prettier', files, {
			cache: true,
			cacheLocation: '.prettiercache',
			logLevel: 'warn',
			write: this.hasFix,
			check: !this.hasFix
		});
		return Lint.instance;
	}

	finalize(): void {
		Lint.instance = undefined;
	}

	private static executeCommand(commandName: string, files: string | string[], options?: Record<string, string | boolean>): void {
		executeCommand(this.buildCommand(commandName, Array.isArray(files) ? files : [files], options), true);
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
