import {type ChildProcess, spawn} from 'node:child_process';
import {join} from 'node:path';

import {getActivationLine, getPublishLine, resolveShellTarget} from '../utils/shell.js';
import {
	configPath,
	ensureRuntimeFiles,
	isRegistryReady,
	npmrcPath,
	readinessPollInterval,
	registryHost,
	registryRoot,
	registryStartupTimeout,
	registryUrl,
	runtimeDirectory,
	verdaccioPath,
} from '../utils/runtime.js';

/** Starts Verdaccio, waits for readiness, and keeps the process attached to the terminal. */
export async function startRegistry(): Promise<void> {
	ensureRuntimeFiles();
	const child = spawnVerdaccio();
	const forwardSignal = (signal: NodeJS.Signals): void => {
		if (child.exitCode === null && child.signalCode === null) {
			child.kill(signal);
		}
	};
	process.once('SIGINT', forwardSignal);
	process.once('SIGTERM', forwardSignal);

	try {
		await waitForRegistry(child);
		printInstructions();
		await waitForProcess(child);
	} finally {
		process.removeListener('SIGINT', forwardSignal);
		process.removeListener('SIGTERM', forwardSignal);
		if (child.exitCode === null && child.signalCode === null) {
			child.kill('SIGINT');
		}
	}
}

/** Starts Verdaccio with the checked-in configuration and local runtime directory. */
function spawnVerdaccio(): ChildProcess {
	return spawn(process.execPath, [verdaccioPath, '--config', configPath, '--listen', registryHost], {
		cwd: registryRoot,
		stdio: 'ignore',
	});
}

/** Polls the local ping endpoint until Verdaccio is ready or the startup times out. */
async function waitForRegistry(child: ChildProcess): Promise<void> {
	const deadline = Date.now() + registryStartupTimeout;
	while (Date.now() < deadline) {
		if (child.exitCode !== null || child.signalCode !== null) {
			throw new Error('Verdaccio stopped before becoming ready. See runtime/verdaccio.log.');
		}
		// The probe and the delay must run in sequence so the retry interval remains predictable.
		// eslint-disable-next-line no-await-in-loop
		if (await isRegistryReady()) {
			return;
		}
		// eslint-disable-next-line no-await-in-loop
		await delay(readinessPollInterval);
	}
	throw new Error('Timed out waiting for Verdaccio. See runtime/verdaccio.log.');
}

/** Prints the environment setup required by npm commands in the caller's terminal. */
function printInstructions(): void {
	const logPath = join(runtimeDirectory, 'verdaccio.log');
	const target = resolveShellTarget(process.platform, process.env);
	const activationLine = getActivationLine(target);
	const publishLine = getPublishLine(target);
	console.info(`
============================================================
 Oblique local npm registry is ready
============================================================
 Registry: ${registryUrl}
 npm config: ${npmrcPath}
 Logs: ${logPath}

1. Activate the registry in the terminal where you will run
   npm or ob commands. NPM_CONFIG_REGISTRY overrides any
   registry setting in a project .npmrc file:

${activationLine}

2. Build and publish local packages, or run ob new.

${publishLine}
   ob new <project-name>

Keep this process running. Press Ctrl+C to stop the registry.
============================================================`);
}

/** Resolves when the Verdaccio child exits and rejects if it cannot be monitored. */
async function waitForProcess(child: ChildProcess): Promise<void> {
	await new Promise<void>((resolveProcess, reject) => {
		child.once('error', error => {
			reject(error);
		});
		child.once('exit', () => {
			resolveProcess();
		});
	});
}

/** Waits between readiness checks without blocking the event loop. */
async function delay(milliseconds: number): Promise<void> {
	await new Promise<void>(resolveDelay => {
		setTimeout(resolveDelay, milliseconds);
	});
}
