import {
	optionDescriptions as cliOptions,
	commandUsageText,
	createAdditionalHelpText,
	exampleUsageText,
	getHelpText,
	obTitle,
	runObCommand,
	startObCommand,
	titleText
} from './cli-utils';
import SpyInstance = jest.SpyInstance;

test('cliOptions.version.flags should be correct', () => {
	expect(cliOptions.ob.version.flags).toBe('-v, --version');
});

test('cliOptions.version.description should be correct', () => {
	expect(cliOptions.ob.version.description).toBe('Shows the current version of @oblique/cli');
});

test('cliOptions.version.command should be correct', () => {
	expect(cliOptions.ob.version.command).toBe('ob -v');
});

test('obTitle should have correct value', () => {
	expect(obTitle).toBe('Oblique Cli');
});

test('cliOptions.help.flags should be correct', () => {
	expect(cliOptions.ob.help.flags).toBe('-h, --help');
});

test('cliOptions.help.description should be correct', () => {
	expect(cliOptions.ob.help.description).toBe('Shows a help message for the "ob" command in the console.');
});

test('cliOptions.help.command should be correct', () => {
	expect(cliOptions.ob.help.command).toBe('ob -h');
});

test('runObCommand should log correct message', () => {
	const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
	runObCommand();
	expect(consoleSpy).toHaveBeenCalledWith(
		'\n  Use `ob new <project-name>` to create a new project\n  Use `ob --help` to explore the available commands\n'
	);
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

		startObCommand(callback, label, options);

		expect(callback).toHaveBeenCalledWith(options);
	});

	test('should log start time with label', () => {
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(callback, label, options);

		expect(consoleTimeSpy).toHaveBeenCalledWith(label);
	});

	test('should log end time with label', () => {
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(callback, label, options);

		expect(consoleTimeEndSpy).toHaveBeenCalledWith(label);
	});

	test('should log title', () => {
		const title = 'Oblique Cli';
		const uppercaseTitle = title.toUpperCase();
		const options = {key: 'value'};
		const label = 'Test Label';

		startObCommand(callback, label, options);

		expect(consoleInfoSpy).toHaveBeenCalledWith(uppercaseTitle);
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
	const expectedOutput = `
Examples of use:
  ob newCreates a new project
  ob updateUpdates the project`;
	const result = exampleUsageText(examples);
	expect(result).toBe(expectedOutput);
});

describe('createAdditionalHelpText', () => {
	const spaceUnit = ' ';

	test('should return a properly formatted string', () => {
		const title = 'Usage';
		const examples = [
			{command: 'cmd1', description: 'description1'},
			{command: 'cmd2', description: 'description2'}
		];
		const maxCommandWidth = 4;

		const result = createAdditionalHelpText(title, examples, maxCommandWidth);
		const expected = ['Usage', ` ${spaceUnit}cmd1     description1\n${spaceUnit} cmd2     description2`].join('');

		expect(result).toBe(expected);
	});

	test('should handle empty examples array', () => {
		const title = 'Usage';
		const examples: {command: string; description: string}[] = [];
		const maxCommandWidth = 4;

		const result = createAdditionalHelpText(title, examples, maxCommandWidth);
		const expected = 'Usage';

		expect(result).toBe(expected);
	});

	test('should pad commands correctly with given maxCommandWidth', () => {
		const title = 'Usage';
		const examples = [
			{command: 'cmd1', description: 'description1'},
			{command: 'cmd2', description: 'description2'}
		];
		const maxCommandWidth = 5;

		const result = createAdditionalHelpText(title, examples, maxCommandWidth);
		const expected = ['Usage', `${spaceUnit}cmd1    description1\n${spaceUnit}cmd2    description2`].join('');

		expect(cleanOutput(result)).toBe(cleanOutput(expected));
	});

	test('should handle longer commands correctly without truncation', () => {
		const title = 'Usage';
		const examples = [
			{command: 'longcommand1 ', description: 'description1'},
			{command: 'cmd2', description: 'description2'}
		];

		const result = createAdditionalHelpText(title, examples, examples[0].command.length);

		expect(result).toBe(
			[
				[
					title,
					'  ',
					examples[0].command,
					'     ',
					examples[0].description,
					'\n  ',
					examples[1].command,
					'              ',
					examples[1].description
				].join('')
			].join('')
		);
	});
});

function cleanOutput(output: Buffer | string): string {
	const outputString = output.toString();
	return outputString.replace(/\s+/g, ' ').trim();
}
