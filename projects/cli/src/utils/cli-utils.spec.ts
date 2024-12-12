import {
	buildOption,
	commandUsageText,
	createAdditionalHelpText,
	exampleUsageText,
	execute,
	getHelpText,
	obExamples,
	optionDescriptions,
	runObCommand,
	startObCommand,
	titleText
} from './cli-utils';

describe('CLI Utils', () => {
	const nodeChildProcess: typeof import('node:child_process') = jest.requireActual('node:child_process');

	beforeAll(() => {
		// Mock console methods to capture their outputs
		console.info = jest.fn();
		console.time = jest.fn();
		console.timeEnd = jest.fn();
	});

	describe('optionDescriptions', () => {
		test('optionDescriptions.ob.version.description should be correct', () => {
			expect(optionDescriptions.ob.version.description).toBe('Shows the current version of @oblique/cli');
		});

		test('optionDescriptions.ob.help.description should be correct', () => {
			expect(optionDescriptions.ob.help.description).toBe(getHelpText('ob'));
		});

		test('optionDescriptions.new.help.description should be correct', () => {
			expect(optionDescriptions.new.help.description).toBe(getHelpText('ob new'));
		});
	});

	describe('obExamples', () => {
		test('obExamples should be correct', () => {
			expect(obExamples).toEqual([
				{command: optionDescriptions.ob.version.command, description: optionDescriptions.ob.version.description},
				{command: optionDescriptions.ob.help.command, description: optionDescriptions.ob.help.description},
				{command: optionDescriptions.new.obNewCommand.command, description: optionDescriptions.new.obNewCommand.description},
				{command: optionDescriptions.new.help.command, description: optionDescriptions.new.help.description},
				{command: optionDescriptions.update.obUpdateCommand.command, description: optionDescriptions.update.obUpdateCommand.description}
			]);
		});
	});

	describe('runObCommand', () => {
		test('runObCommand should log the correct messages', () => {
			runObCommand();
			expect(console.info).toHaveBeenCalledWith(expect.stringContaining(`Use \`ob new <project-name>\` to create a new project`));
		});

		test('runObCommand should log the help command message', () => {
			runObCommand();
			expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Use `ob --help` to explore the available commands'));
		});

		test('runObCommand should log the new help command message', () => {
			runObCommand();
			expect(console.info).toHaveBeenCalledWith(
				expect.stringContaining('Or use `ob new --help` to explore the available options for the ob new command')
			);
		});
	});

	describe('getHelpText', () => {
		test('getHelpText("ob") should return correct help text', () => {
			expect(getHelpText('ob')).toBe('Shows a help message for the "ob" command in the console');
		});

		test('getHelpText("ob new") should return correct help text', () => {
			expect(getHelpText('ob new')).toBe('Shows a help message for the "ob new" command in the console');
		});
	});

	describe('startObCommand', () => {
		test('startObCommand should start the timer', () => {
			const mockCallback = jest.fn();
			const label = 'test label';
			const options = {test: 'test'};

			startObCommand(mockCallback, label, options);

			expect(console.time).toHaveBeenCalledWith(label);
		});

		test('startObCommand should execute the callback', () => {
			const mockCallback = jest.fn();
			const label = 'test label';
			const options = {test: 'test'};

			startObCommand(mockCallback, label, options);

			expect(mockCallback).toHaveBeenCalledWith(options);
		});

		test('startObCommand should end the timer', () => {
			const mockCallback = jest.fn();
			const label = 'test label';
			const options = {test: 'test'};

			startObCommand(mockCallback, label, options);

			expect(console.timeEnd).toHaveBeenCalledWith(label);
		});
	});

	describe('commandUsageText', () => {
		test.each([
			{subCommand: `new` as 'new' | 'update' | '<command>', option: undefined, expected: `<project-name> [...options]`},
			{subCommand: `new` as 'new' | 'update' | '<command>', option: 'options', expected: `<project-name> options`},
			{subCommand: `update` as 'new' | 'update' | '<command>', option: 'options', expected: `options`},
			{subCommand: `<command>` as 'new' | 'update' | '<command>', expected: `<command> [...options]`},
			{subCommand: undefined as 'new' | 'update' | '<command>', expected: `<command> [...options]`}
		])('commandUsageText("$property") should return correct usage text', ({subCommand, option, expected}) => {
			expect(commandUsageText(subCommand, option)).toBe(expected);
		});

		test('commandUsageText("<command>") should return correct usage text', () => {
			expect(commandUsageText('<command>')).toBe('<command> [...options]');
		});

		test('commandUsageText("update") should return correct usage text', () => {
			expect(commandUsageText('update', ' ')).toBe(' ');
		});
	});

	describe('exampleUsageText', () => {
		test('exampleUsageText should return formatted examples', () => {
			const examples = [
				{command: 'ob new', description: 'Creates a new project'},
				{command: 'ob update', description: 'Updates the project'}
			];
			const expectedOutput = `
Examples of use:
\tob newCreates a new project
\tob updateUpdates the project`;
			const result = exampleUsageText(examples);
			expect(result).toBe(expectedOutput);
		});

		test('exampleUsageText should return formatted example usage text', () => {
			const examples = [
				{command: 'ob -v', description: ' Shows the current version of @oblique/cli'},
				{command: 'ob -h', description: ' Shows a help message for the "ob" command in the console'}
			];
			const expectedOutput =
				'\nExamples of use:\n\tob -v Shows the current version of @oblique/cli\n\tob -h Shows a help message for the "ob" command in the console';
			const result = exampleUsageText(examples);
			expect(result).toBe(expectedOutput);
		});
	});

	describe('createAdditionalHelpText', () => {
		test('should return a properly formatted string', () => {
			const title = 'Usage';
			const examples = [
				{command: 'cmd1', description: 'description1'},
				{command: 'cmd2', description: 'description2'}
			];
			const maxCommandWidth = 4;

			const result = createAdditionalHelpText(title, examples, maxCommandWidth);
			const expected = ['Usage', `\tcmd1     description1\n\tcmd2     description2`].join('');

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
			const maxCommandWidth = 6;

			const result = createAdditionalHelpText(title, examples, maxCommandWidth);
			const expected = ['Usage', `\tcmd1       description1\n\tcmd2       description2`].join('');

			expect(result).toBe(expected);
		});

		test('should handle longer commands correctly without truncation', () => {
			const title = 'Usage';
			const examples = [
				{command: 'longcommand1', description: 'description1'},
				{command: 'cmd2', description: 'description2'}
			];
			const maxCommandWidth = examples[0].command.length;

			const result = createAdditionalHelpText(title, examples, maxCommandWidth);
			const expected = ['Usage', `\tlongcommand1     description1\n\tcmd2             description2`].join('');

			expect(result).toBe(expected);
		});

		test('createAdditionalHelpText should return help text with padded commands', () => {
			const title = '\nExample usages:\n';
			const examples = [
				{command: 'ob -v', description: 'Shows the current version of @oblique/cli'},
				{command: 'ob -h', description: 'Shows a help message for the "ob" command in the console'}
			];
			const maxCommandWidth = 5;
			const expectedOutput =
				'\nExample usages:\n\tob -v     Shows the current version of @oblique/cli\n\tob -h     Shows a help message for the "ob" command in the console';
			expect(createAdditionalHelpText(title, examples, maxCommandWidth)).toBe(expectedOutput);
		});
	});

	describe('titleText', () => {
		test('titleText should return title text with default delimiters', () => {
			const title = 'Test Title';
			expect(titleText(title)).toBe('\nTest Title\n');
		});

		test('titleText should return title text with custom delimiters', () => {
			const title = 'Test Title';
			expect(titleText(title, '', ' - ')).toBe('Test Title - ');
		});
	});

	describe('buildOption', () => {
		test('should return key="value" with a string value', () => {
			expect(buildOption('key', 'value')).toEqual('key="value"');
		});

		test('should return key with true as value', () => {
			expect(buildOption('key', true)).toEqual('key');
		});

		test('should return no-key with false as value', () => {
			expect(buildOption('key', false)).toEqual('no-key');
		});
	});

	describe('execute', () => {
		beforeEach(() => {
			jest.spyOn(nodeChildProcess, 'execSync').mockImplementation(() => 'ok');
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		describe('ngNew', () => {
			test.each([
				{text: 'without', options: undefined},
				{text: 'with empty', options: {}}
			])('%text options object', ({options}) => {
				execute({name: 'ngNew', projectName: 'project', options});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 new project', {stdio: 'inherit'});
			});

			test('with filled options object', () => {
				execute({name: 'ngNew', projectName: 'project', options: {truthyFlag: true, falsyFlag: false, option: 'value'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith(
					'npx @angular/cli@18 new project --truthyFlag --no-falsyFlag --option="value"',
					{stdio: 'inherit'}
				);
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'ngNew', projectName: 'project', execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 new project', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'ngNew', projectName: 'project', execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 new project', {stdio: 'pipe'});
			});
		});

		describe('ngAdd', () => {
			test.each([
				{text: 'without', options: undefined},
				{text: 'with empty', options: {}}
			])('%text options object', ({options}) => {
				execute({name: 'ngAdd', dependency: 'jest', options});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 add jest@29', {stdio: 'inherit'});
			});

			test('with filled options object', () => {
				execute({name: 'ngAdd', dependency: 'jest', options: {truthyFlag: true, falsyFlag: false, option: 'value'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith(
					'npx @angular/cli@18 add jest@29 --truthyFlag --no-falsyFlag --option="value"',
					{stdio: 'inherit'}
				);
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'ngAdd', dependency: 'jest', execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 add jest@29', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'ngAdd', dependency: 'jest', execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 add jest@29', {stdio: 'pipe'});
			});
		});

		describe('ngUpdate', () => {
			test('with a single dependency', () => {
				execute({name: 'ngUpdate', dependencies: ['jest']});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 update jest@29', {stdio: 'inherit'});
			});
			test('with multiple dependencies', () => {
				execute({name: 'ngUpdate', dependencies: ['jest', '@types/jest']});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 update jest@29 @types/jest@29', {stdio: 'inherit'});
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'ngUpdate', dependencies: ['jest'], execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 update jest@29', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'ngUpdate', dependencies: ['jest'], execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npx @angular/cli@18 update jest@29', {stdio: 'pipe'});
			});
		});

		describe('npmInstall', () => {
			test('with one dependency', () => {
				execute({name: 'npmInstall', dependencies: ['jest']});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm install jest@29', {stdio: 'inherit'});
			});

			test('with multiple dependencies', () => {
				execute({name: 'npmInstall', dependencies: ['jest', '@types/jest']});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm install jest@29 @types/jest@29', {stdio: 'inherit'});
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'npmInstall', dependencies: ['jest'], execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm install jest@29', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'npmInstall', dependencies: ['jest'], execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm install jest@29', {stdio: 'pipe'});
			});
		});

		describe('npmUpdate', () => {
			test('without additional execSyncOptions', () => {
				execute({name: 'npmUpdate'});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm update --save', {stdio: 'inherit'});
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'npmUpdate', execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm update --save', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'npmUpdate', execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm update --save', {stdio: 'pipe'});
			});
		});

		describe('npmOutdated', () => {
			test('without additional execSyncOptions', () => {
				execute({name: 'npmOutdated'});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm outdated', {stdio: 'inherit'});
			});

			test('with an additional execSyncOptions', () => {
				execute({name: 'npmOutdated', execSyncOptions: {cwd: 'test'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm outdated', {stdio: 'inherit', cwd: 'test'});
			});

			test('with an overwriting execSyncOptions', () => {
				execute({name: 'npmOutdated', execSyncOptions: {stdio: 'pipe'}});
				expect(nodeChildProcess.execSync).toHaveBeenCalledWith('npm outdated', {stdio: 'pipe'});
			});
		});
	});
});
