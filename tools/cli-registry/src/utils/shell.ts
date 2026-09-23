/** Shell syntaxes the commands can emit, plus the unsupported cmd.exe. */
export type ShellTarget = 'posix' | 'powershell' | 'cmd';

/** Resolves the shell syntax target from the platform and environment. */
export function resolveShellTarget(platform: NodeJS.Platform, env: NodeJS.ProcessEnv): ShellTarget {
	if (platform !== 'win32') {
		return 'posix';
	}
	// Git bash on Windows exports SHELL and MSYSTEM, and understands POSIX exports.
	const hasPosixShell = Boolean(env['SHELL']) || Boolean(env['MSYSTEM']);
	if (hasPosixShell) {
		return 'posix';
	}
	// PowerShell sets PSModulePath, cmd.exe does not.
	const hasPowerShell = Boolean(env['PSModulePath']);
	if (hasPowerShell) {
		return 'powershell';
	}
	return 'cmd';
}

/** Formats the npm environment exports for the resolved shell syntax. */
export function formatShellExports(target: 'posix' | 'powershell', npmConfigPath: string, registry: string): string {
	if (target === 'powershell') {
		return `$env:NPM_CONFIG_USERCONFIG = "${npmConfigPath}"\n$env:NPM_CONFIG_REGISTRY = "${registry}/"\n`;
	}
	return `export NPM_CONFIG_USERCONFIG="${npmConfigPath}"\nexport NPM_CONFIG_REGISTRY="${registry}/"\n`;
}

/** Returns the one-line activation command for the detected shell. */
export function getActivationLine(target: ShellTarget): string {
	if (target === 'powershell') {
		return '   obreg env | Invoke-Expression';
	}
	if (target === 'cmd') {
		return '   obreg env | Invoke-Expression   (run from PowerShell, cmd.exe is not supported)';
	}
	return '   eval "$(obreg env)"';
}

/** Returns the publish command for the detected shell, using the path syntax it understands. */
export function getPublishLine(target: ShellTarget): string {
	if (target === 'posix') {
		return '   npm publish ./dist/<package-directory> --tag local';
	}
	// PowerShell and cmd.exe use backslash path separators.
	return '   npm publish .\\dist\\<package-directory> --tag local';
}
