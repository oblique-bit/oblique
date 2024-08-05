import {
	optionDescriptions as cliOptions,
	commandUsageText,
	exampleUsageText,
	getHelpText,
	obTitle,
	obUsageText,
	runObCommand,
	startObCommand,
	titleText
} from './cli-utils';
import SpyInstance = jest.SpyInstance;

test('cliOptions.version.flags should be correct', () => {
	expect(cliOptions.version.flags).toBe('-v, --version');
});

test('cliOptions.version.description should be correct', () => {
	expect(cliOptions.version.description).toBe('Shows the current version of @oblique/cli');
});

test('cliOptions.version.command should be correct', () => {
	expect(cliOptions.version.command).toBe('ob -v');
});

test('obTitle should have correct value', () => {
	expect(obTitle).toBe('Oblique Cli');
});

test('cliOptions.help.flags should be correct', () => {
	expect(cliOptions.help.flags).toBe('-h, --help');
});

test('cliOptions.help.description should be correct', () => {
	expect(cliOptions.help.description).toBe('Shows a help message for the "ob" command in the console.');
});

test('cliOptions.help.command should be correct', () => {
	expect(cliOptions.help.command).toBe('ob -h');
});

test('obUsageText should generate correct command usage text', () => {
	expect(obUsageText).toBe('<command> [option]');
});

test('runObCommand should log correct message', () => {
	const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
	runObCommand();
	expect(consoleSpy).toHaveBeenCalledWith('\nOblique CLI is running now!\n');
	consoleSpy.mockRestore();
});

test('titleText should return formatted title with default delimiters', () => {
	const title = 'Oblique Cli';
	expect(titleText(title)).toBe(`\n${title}\n`);
});

test('titleText should return formatted title with custom delimiters', () => {
	const title = 'Oblique Cli';
	expect(titleText(title, '>>', '<<')).toBe(`>>${title}<<`);
});

test('getHelpText should return correct help text', () => {
	expect(getHelpText('ob')).toBe('Shows a help message for the "ob" command in the console.');
});

describe('startObCommand', () => {
	let callback = jest.fn();
	let consoleInfoSpy: SpyInstance;
	let consoleTimeSpy: SpyInstance;
	let consoleTimeEndSpy: SpyInstance;

	beforeEach(() => {
		consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
		consoleTimeSpy = jest.spyOn(console, 'time').mockImplementation(() => {});
		consoleTimeEndSpy = jest.spyOn(console, 'timeEnd').mockImplementation(() => {});
		callback = jest.fn();
	});

	afterEach(() => {
		consoleInfoSpy.mockRestore();
		consoleTimeSpy.mockRestore();
		consoleTimeEndSpy.mockRestore();
	});

	test('should call callback with options', () => {
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(options, callback, label);

		expect(callback).toHaveBeenCalledWith(options);
	});

	test('should log start time with label', () => {
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(options, callback, label);

		expect(consoleTimeSpy).toHaveBeenCalledWith(label);
	});

	test('should log end time with label', () => {
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(options, callback, label);

		expect(consoleTimeEndSpy).toHaveBeenCalledWith(label);
	});

	test('should log title', () => {
		const title = 'Oblique Cli';
		const uppercaseTitle = title.toUpperCase();
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(options, callback, label);

		expect(consoleInfoSpy).toHaveBeenCalledWith(`${uppercaseTitle} `);
	});
});

test('commandUsageText with default parameters should return "<command> [option]"', () => {
	expect(commandUsageText()).toBe('<command> [option]');
});

test('commandUsageText with "new" parameter should return "new [option]"', () => {
	expect(commandUsageText('new')).toBe('new [option]');
});

test('commandUsageText with "update" and "--force" parameters should return "update --force"', () => {
	expect(commandUsageText('update', '--force')).toBe('update --force');
});

test('exampleUsageText should return formatted examples', () => {
	const examples = [
		{command: 'ob new', description: 'Creates a new project'},
		{command: 'ob update', description: 'Updates the project'}
	];
	const expectedOutput = `Examples of use: ob new Creates a new project ob update Updates the project`;
	const result = exampleUsageText(examples);
	expect(cleanOutput(result)).toBe(expectedOutput);
});

function cleanOutput(output: Buffer | string): string {
	const outputString = output.toString();
	return outputString.replace(/\s+/g, ' ').trim();
}
