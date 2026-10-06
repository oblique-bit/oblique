import process from 'node:process';
import {type ExitCode, exitCode} from '../utils/exit-code.js';
import {isRegistryReady, npmrcPath, registryUrl} from '../utils/runtime.js';
import {formatShellExports, resolveShellTarget} from '../utils/shell.js';

/** Prints the shell activation snippet, returning the process exit code. */
export async function printEnv(): Promise<ExitCode> {
	const target = resolveShellTarget(process.platform, process.env);
	if (target === 'cmd') {
		console.error(getCmdRefusal());
		return exitCode.failure;
	}
	// Raw stream write: the output is shell code for eval, so it must stay byte-exact and end with
	// exactly one newline, which the caller controls. console.log would append its own newline and
	// format the string.
	process.stdout.write(formatShellExports(target, npmrcPath, registryUrl));
	if (!(await isRegistryReady())) {
		console.error(getRegistryWarning());
	}
	return exitCode.success;
}

/** Returns the refusal printed when the shell is cmd.exe. */
function getCmdRefusal(): string {
	return 'cmd.exe is not supported. Run from PowerShell instead: obreg env | Invoke-Expression\n';
}

/** Returns the warning printed when the registry is not reachable. */
function getRegistryWarning(): string {
	return `Registry ${registryUrl} is not running. Run obreg start first.\n`;
}
