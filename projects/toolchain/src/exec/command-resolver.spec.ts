import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import resolveCommand from './command-resolver.js';

describe('resolveCommand', () => {
	let tempDir: string;
	const originalPlatform = process.platform;
	const expectedWindowsCommand = (command: string): string => (command.includes(' ') ? `"${command}"` : command);

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'command-resolver-'));
	});

	afterEach(() => {
		fs.rmSync(tempDir, {recursive: true, force: true});
		Object.defineProperty(process, 'platform', {value: originalPlatform, configurable: true});
		vi.unstubAllEnvs();
	});

	function mockWindowsPlatform(): void {
		Object.defineProperty(process, 'platform', {value: 'win32', configurable: true});
	}

	describe('on non-Windows platforms', () => {
		test('returns the command unchanged', () => {
			Object.defineProperty(process, 'platform', {value: 'linux', configurable: true});
			expect(resolveCommand('npm')).toBe('npm');
		});

		test('returns the command unchanged even if it does not exist', () => {
			Object.defineProperty(process, 'platform', {value: 'darwin', configurable: true});
			expect(resolveCommand('does-not-exist')).toBe('does-not-exist');
		});
	});

	describe('on Windows', () => {
		beforeEach(() => {
			mockWindowsPlatform();
			vi.stubEnv('PATHEXT', '.cmd;.exe');
			vi.stubEnv('PATH', tempDir);
		});

		test('returns the command as-is when it already exists', () => {
			const existing = path.join(tempDir, 'tool.cmd');
			fs.writeFileSync(existing, '');
			expect(resolveCommand(existing)).toBe(expectedWindowsCommand(existing));
		});

		test('prefers a PATHEXT executable over an existing extensionless file', () => {
			const base = path.join(tempDir, 'tool');
			const executable = `${base}.cmd`;
			fs.writeFileSync(base, '');
			fs.writeFileSync(executable, '');
			expect(resolveCommand(base)).toBe(expectedWindowsCommand(executable));
		});

		test('does not let a directory with the same name shadow the executable', () => {
			fs.mkdirSync(path.join(tempDir, 'tool'));
			const executable = path.join(tempDir, 'tool.cmd');
			fs.writeFileSync(executable, '');
			expect(resolveCommand('tool')).toBe(expectedWindowsCommand(executable));
		});

		test('returns the command unchanged when the as-given candidate is a directory', () => {
			fs.mkdirSync(path.join(tempDir, 'tool'));
			const candidate = path.join(tempDir, 'tool');
			expect(resolveCommand(candidate)).toBe(expectedWindowsCommand(candidate));
		});

		test('returns the command unchanged when PATHEXT is missing', () => {
			vi.stubEnv('PATHEXT', undefined as unknown as string);
			expect(resolveCommand('does-not-exist')).toBe('does-not-exist');
		});

		test('returns an existing command when PATHEXT is missing', () => {
			vi.stubEnv('PATHEXT', undefined as unknown as string);
			const existing = path.join(tempDir, 'tool');
			fs.writeFileSync(existing, '');
			expect(resolveCommand(existing)).toBe(expectedWindowsCommand(existing));
		});

		test('returns the command unchanged when PATH is missing', () => {
			vi.stubEnv('PATH', undefined as unknown as string);
			expect(resolveCommand('does-not-exist')).toBe('does-not-exist');
		});

		test('returns the command unchanged when PATHEXT is empty', () => {
			vi.stubEnv('PATHEXT', '');
			expect(resolveCommand('does-not-exist')).toBe('does-not-exist');
		});

		test('returns the absolute command with the appended extension as-is', () => {
			const base = path.join(tempDir, 'tool');
			fs.writeFileSync(`${base}.cmd`, '');
			expect(resolveCommand(base)).toBe(expectedWindowsCommand(`${base}.cmd`));
		});

		test('finds the command in the current working directory with the first extension', () => {
			const originalCwd = process.cwd();
			const cwdDir = fs.mkdtempSync(path.join(os.tmpdir(), 'command-resolver-cwd-'));
			const candidate = path.join(cwdDir, 'tool.cmd');
			fs.writeFileSync(candidate, '');
			try {
				process.chdir(cwdDir);
				vi.stubEnv('PATH', tempDir);
				expect(resolveCommand('tool')).toBe(expectedWindowsCommand(candidate));
			} finally {
				process.chdir(originalCwd);
				fs.rmSync(cwdDir, {recursive: true, force: true});
			}
		});

		test('finds the command in a PATH directory with the first extension', () => {
			const candidate = path.join(tempDir, 'tool.cmd');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand('tool')).toBe(expectedWindowsCommand(candidate));
		});

		test('finds the command in a PATH directory with a later extension', () => {
			const candidate = path.join(tempDir, 'tool.exe');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand('tool')).toBe(expectedWindowsCommand(candidate));
		});

		test('prefers an earlier PATH directory over a later extension', () => {
			const firstPathDir = fs.mkdtempSync(path.join(os.tmpdir(), 'command-resolver-first-'));
			const secondPathDir = fs.mkdtempSync(path.join(os.tmpdir(), 'command-resolver-second-'));
			const exeInFirstDir = path.join(firstPathDir, 'tool.exe');
			const cmdInSecondDir = path.join(secondPathDir, 'tool.cmd');
			fs.writeFileSync(exeInFirstDir, '');
			fs.writeFileSync(cmdInSecondDir, '');
			try {
				vi.stubEnv('PATH', `${firstPathDir};${secondPathDir}`);
				expect(resolveCommand('tool')).toBe(expectedWindowsCommand(exeInFirstDir));
			} finally {
				fs.rmSync(firstPathDir, {recursive: true, force: true});
				fs.rmSync(secondPathDir, {recursive: true, force: true});
			}
		});

		test('skips empty extensions in PATHEXT', () => {
			vi.stubEnv('PATHEXT', ';.exe;');
			const candidate = path.join(tempDir, 'tool.exe');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand('tool')).toBe(expectedWindowsCommand(candidate));
		});

		test('returns the command unchanged when nothing is found', () => {
			expect(resolveCommand('missing')).toBe('missing');
		});

		test('quotes an absolute command path when it contains a space', () => {
			const candidate = path.join(tempDir, 'tool with space.cmd');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand(candidate)).toBe(expectedWindowsCommand(candidate));
		});

		test('does not quote an already quoted command path', () => {
			const candidate = path.join(tempDir, 'tool with space.cmd');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand(`"${candidate}"`)).toBe(`"${candidate}"`);
		});

		test('quotes an absolute command path according to its spaces', () => {
			const candidate = path.join(tempDir, 'tool.cmd');
			fs.writeFileSync(candidate, '');
			expect(resolveCommand(candidate)).toBe(expectedWindowsCommand(candidate));
		});
	});

	describe('quoting on non-Windows platforms', () => {
		test('returns a space-containing command unchanged', () => {
			Object.defineProperty(process, 'platform', {value: 'linux', configurable: true});
			expect(resolveCommand('tool with space')).toBe('tool with space');
		});
	});
});
