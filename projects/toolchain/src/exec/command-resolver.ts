/*
 * DUPLICATED CODE: This file is a verbatim copy of `projects/cli/src/utils/command-resolver.ts`
 * (OUI-4645). The two packages are independent — @oblique/cli does not depend on @oblique/toolchain, and
 * a cross-package import is blocked by toolchain's `rootDir: "src/"` build (tsconfig.lib.json /
 * tsconfig.esm.json).
 */
import {statSync} from 'node:fs';
import path from 'node:path';

/**
 * Resolves the command to an executable that can be spawned on the current platform.
 *
 * On non-Windows platforms the command is returned unchanged, as the operating system
 * resolves executables through its own mechanism (e.g. `PATH` via `execvp`).
 *
 * On Windows, commands often need a file extension to be executable (e.g. `npm` needs
 * to be called as `npm.cmd`). The extension is not always `.cmd` and the command might
 * already include it. This resolver therefore:
 * - returns the command as-is if it already exists and includes an extension from PATHEXT
 *   (or if PATHEXT is unavailable),
 * - otherwise appends each extension from `PATHEXT` and searches the current working
 *   directory first, then each `PATH` directory in listed order, trying every extension
 *   within each directory before moving to the next one (directory-major, matching
 *   `cmd.exe`'s resolution), returning the first hit,
 * - quotes the resolved command when it contains spaces, so that `cmd.exe` can parse
 *   the command correctly,
 * - returns the command unchanged if nothing is found, so that `spawnSync`'s existing
 *   error handling can report the failure.
 *
 * @param command The command to resolve, for example `npm`
 * @returns The resolved command
 */
export default function resolveCommand(command: string): string {
	if (process.platform !== 'win32') {
		return command;
	}

	if (isExistingFile(command) && hasExecutableExtension(command)) {
		return quoteCommand(command);
	}

	return quoteCommand(findExecutable(command) ?? command);
}

function hasExecutableExtension(command: string): boolean {
	const pathExt = process.env['PATHEXT'];
	if (!pathExt) {
		return true;
	}

	const extension = path.extname(command).toLowerCase();
	return pathExt.split(';').some(pathExtension => pathExtension.toLowerCase() === extension);
}

/**
 * Appends each extension from `PATHEXT` to the command and searches the current working
 * directory first, then each `PATH` directory in listed order, trying every extension
 * within each directory before moving to the next one (directory-major, matching
 * `cmd.exe`'s resolution), returning the first hit, or `undefined` when `PATHEXT` or
 * `PATH` is missing.
 */
function findExecutable(command: string): string | undefined {
	const pathExt = process.env['PATHEXT'];
	const pathValue = process.env['PATH'];
	if (!pathExt || !pathValue) {
		return undefined;
	}

	const extensions = pathExt.split(';').filter(extension => extension.length > 0);
	const directories = [process.cwd(), ...pathValue.split(';')];

	const candidates = directories.flatMap(directory =>
		extensions.map(extension => path.resolve(directory, `${command}${extension}`))
	);
	return candidates.find(isExistingFile);
}

/**
 * Checks whether the candidate is an existing file, ignoring directories — a directory
 * with the same name must not shadow a real executable (e.g. a `npm/` folder next to
 * `npm.cmd`).
 */
function isExistingFile(candidate: string): boolean {
	return statSync(candidate, {throwIfNoEntry: false})?.isFile() ?? false;
}

/**
 * Wraps a resolved command path in double quotes when it contains a space, so that
 * `cmd.exe` can parse it correctly when the command is spawned through `shell: true`.
 * Space-free paths are returned unchanged, and already-quoted paths are not quoted again.
 *
 * @param command The resolved command path, for example `C:\Program Files\nodejs\npm.cmd`
 * @returns The quoted command path, or the original path when it has no space
 */
function quoteCommand(command: string): string {
	const isQuoted = command.startsWith('"') && command.endsWith('"');
	return command.includes(' ') && !isQuoted ? `"${command}"` : command;
}
