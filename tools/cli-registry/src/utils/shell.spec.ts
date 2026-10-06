import {describe, expect, it} from 'vitest';

import {formatShellExports, getActivationLine, getPublishLine, resolveShellTarget} from './shell.js';
import {npmrcPath, registryUrl} from './runtime.js';

describe('resolveShellTarget', () => {
	it('resolves posix on non-Windows platforms', () => {
		expect(resolveShellTarget('linux', {})).toBe('posix');
		expect(resolveShellTarget('darwin', {})).toBe('posix');
	});

	it('resolves posix for git bash on Windows', () => {
		expect(resolveShellTarget('win32', {SHELL: '/usr/bin/bash'})).toBe('posix');
		expect(resolveShellTarget('win32', {MSYSTEM: 'MINGW64'})).toBe('posix');
	});

	it('resolves powershell when PSModulePath is set', () => {
		expect(resolveShellTarget('win32', {PSModulePath: 'C:\\PowerShell\\Modules'})).toBe('powershell');
	});

	it('locks cmd.exe out when no shell indicator is present', () => {
		expect(resolveShellTarget('win32', {})).toBe('cmd');
	});
});

describe('formatShellExports', () => {
	it('formats POSIX exports with double quotes and a trailing registry slash', () => {
		expect(formatShellExports('posix', npmrcPath, registryUrl)).toBe(
			`export NPM_CONFIG_USERCONFIG="${npmrcPath}"\nexport NPM_CONFIG_REGISTRY="${registryUrl}/"\n`
		);
	});

	it('formats PowerShell environment assignments', () => {
		expect(formatShellExports('powershell', npmrcPath, registryUrl)).toBe(
			`$env:NPM_CONFIG_USERCONFIG = "${npmrcPath}"\n$env:NPM_CONFIG_REGISTRY = "${registryUrl}/"\n`
		);
	});
});

describe('getActivationLine', () => {
	it('returns the eval form for POSIX shells', () => {
		expect(getActivationLine('posix')).toBe('   eval "$(obreg env)"');
	});

	it('returns the Invoke-Expression form for PowerShell', () => {
		expect(getActivationLine('powershell')).toBe('   obreg env | Invoke-Expression');
	});

	it('points cmd.exe users to PowerShell', () => {
		expect(getActivationLine('cmd')).toContain('run from PowerShell');
	});
});

describe('getPublishLine', () => {
	it('returns the forward-slash form for POSIX shells', () => {
		expect(getPublishLine('posix')).toBe('   npm publish ./dist/<package-directory> --tag local');
	});

	it('returns the backslash form for PowerShell', () => {
		expect(getPublishLine('powershell')).toBe('   npm publish .\\dist\\<package-directory> --tag local');
	});

	it('returns the backslash form for cmd.exe users directed to PowerShell', () => {
		expect(getPublishLine('cmd')).toBe('   npm publish .\\dist\\<package-directory> --tag local');
	});
});
