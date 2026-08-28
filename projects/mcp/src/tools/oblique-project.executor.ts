/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 secure RxJS project process executor
 */

import {spawn} from 'node:child_process';
import type {Readable} from 'node:stream';
import {Observable} from 'rxjs';
import {
	appendBoundedProjectOutput,
	maximumProjectOutputLength,
	sanitizeProjectOutput,
} from './oblique-project.output.js';

export {maximumProjectOutputLength, sanitizeProjectOutput};

const millisecondsPerSecond = 1_000;
const secondsPerMinute = 60;
const maximumExecutionMinutes = 15;
const forcedTerminationDelayMilliseconds = 5_000;
export const projectExecutionTimeoutMilliseconds = maximumExecutionMinutes * secondsPerMinute * millisecondsPerSecond;

export interface ProjectExecutionRequest {
	executable: string;
	args: string[];
	cwd: string;
	environment: NodeJS.ProcessEnv;
	timeoutMilliseconds?: number;
	signal?: AbortSignal;
}

export interface ProjectExecutionResult {
	exitCode: number | null;
	signal: string | null;
	stdout: string;
	stderr: string;
	outputTruncated?: boolean;
	timedOut: boolean;
	cancelled: boolean;
	durationMs: number;
}

export interface ProjectExecutor {
	execute$: (request: ProjectExecutionRequest) => Observable<ProjectExecutionResult>;
}

export type SpawnProcess = (
	executable: string,
	args: string[],
	options: {
		cwd: string;
		env: NodeJS.ProcessEnv;
		shell: false;
		stdio: ['ignore', 'pipe', 'pipe'];
		windowsHide: true;
		detached: false;
	}
) => ProjectChildProcess;

export interface ProjectChildProcess {
	stdout: Readable;
	stderr: Readable;
	kill: (signal: NodeJS.Signals) => boolean;
	once: (event: 'error' | 'exit' | 'close', listener: (...values: unknown[]) => void) => ProjectChildProcess;
	removeListener: (event: 'error' | 'exit' | 'close', listener: (...values: unknown[]) => void) => ProjectChildProcess;
}
/* istanbul ignore next -- tests inject process execution and must never start a real CLI process. */
const defaultSpawnProcess: SpawnProcess = (executable, args, options) => spawn(executable, args, options);
class ExecutionCapture {
	private child: ProjectChildProcess | undefined;
	private timeout: NodeJS.Timeout | undefined;
	private forcedTermination: NodeJS.Timeout | undefined;
	private stdout = '';
	private stderr = '';
	private outputTruncated = false;
	private timedOut = false;
	private cancelled = false;
	private settled = false;
	private terminationRequested = false;
	private abortSignal: AbortSignal | undefined;
	private readonly startedAt: number;
	private readonly request: ProjectExecutionRequest;
	private readonly spawnProcess: SpawnProcess;
	private readonly now: () => number;
	private readonly subscriber: {next: (result: ProjectExecutionResult) => void; complete: () => void};

	constructor(options: ExecutionCaptureOptions) {
		this.request = options.request;
		this.spawnProcess = options.spawnProcess;
		this.now = options.now;
		this.subscriber = options.subscriber;
		this.startedAt = this.now();
	}
	start(): void {
		try {
			this.child = this.spawnProcess(this.request.executable, this.request.args, getSpawnOptions(this.request));
		} catch {
			this.finish(null, 'Unable to start the Oblique CLI.');
			return;
		}
		this.timeout = setTimeout(
			() => this.timeoutProject(),
			this.request.timeoutMilliseconds ?? projectExecutionTimeoutMilliseconds
		);
		this.child.stdout.on('data', this.stdoutListener);
		this.child.stderr.on('data', this.stderrListener);
		this.child.once('error', this.errorListener);
		this.child.once('exit', this.exitListener);
		this.child.once('close', this.closeListener);
		this.abortSignal = this.request.signal;
		this.abortSignal?.addEventListener('abort', this.abortListener, {once: true});
		if (this.abortSignal?.aborted) {
			this.cancelProject();
		}
	}
	teardown(): void {
		if (!this.settled) {
			this.requestTermination(false);
			this.cleanup();
		}
	}

	private readonly stdoutListener = (chunk: unknown): void => this.appendOutput('stdout', chunk);
	private readonly stderrListener = (chunk: unknown): void => this.appendOutput('stderr', chunk);
	private readonly errorListener = (): void => this.finish(null);
	private readonly exitListener = (): void => undefined;
	private readonly closeListener = (exitCode: unknown, signal: unknown): void =>
		this.finish(typeof exitCode === 'number' ? exitCode : null, '', typeof signal === 'string' ? signal : null);
	private readonly abortListener = (): void => this.cancelProject();
	private appendOutput(stream: 'stdout' | 'stderr', chunk: unknown): void {
		const output = appendBoundedProjectOutput(stream === 'stdout' ? this.stdout : this.stderr, chunk);
		this.outputTruncated ||= output.truncated;
		if (stream === 'stdout') {
			this.stdout = output.value;
		} else {
			this.stderr = output.value;
		}
	}
	private timeoutProject(): void {
		/* istanbul ignore next -- cleanup removes the timer before it can fire after settlement. */
		if (!this.settled) {
			this.timedOut = true;
			this.requestTermination(true);
		}
	}
	private cancelProject(): void {
		/* istanbul ignore next -- cleanup removes the AbortSignal listener before it can fire after settlement. */
		if (!this.settled) {
			this.cancelled = true;
			this.requestTermination(true);
		}
	}
	private requestTermination(scheduleForcedTermination: boolean): void {
		if (this.terminationRequested) {
			return;
		}
		this.terminationRequested = true;
		try {
			this.child?.kill('SIGTERM');
		} catch {
			this.finish(null);
			return;
		}
		if (!scheduleForcedTermination) {
			return;
		}
		this.forcedTermination = setTimeout(() => {
			/* istanbul ignore else -- finish clears this timer before a settled child can reach this callback. */
			if (!this.settled) {
				try {
					this.child?.kill('SIGKILL');
				} catch {
					this.finish(null);
				}
			}
		}, forcedTerminationDelayMilliseconds);
		this.forcedTermination.unref();
	}
	private finish(exitCode: number | null, startupError = '', signal: string | null = null): void {
		if (this.settled) {
			return;
		}
		this.settled = true;
		this.cleanup();
		this.subscriber.next({
			exitCode,
			signal,
			stdout: this.stdout,
			stderr: startupError || this.stderr,
			outputTruncated: this.outputTruncated,
			timedOut: this.timedOut,
			cancelled: this.cancelled,
			durationMs: this.now() - this.startedAt,
		});
		this.subscriber.complete();
	}

	private cleanup(): void {
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout);
		}
		if (this.forcedTermination !== undefined) {
			clearTimeout(this.forcedTermination);
		}
		this.abortSignal?.removeEventListener('abort', this.abortListener);
		this.child?.stdout.removeListener('data', this.stdoutListener);
		this.child?.stderr.removeListener('data', this.stderrListener);
		this.child?.removeListener('error', this.errorListener);
		this.child?.removeListener('exit', this.exitListener);
		this.child?.removeListener('close', this.closeListener);
	}
}

export class NodeProjectExecutor implements ProjectExecutor {
	private readonly spawnProcess: SpawnProcess;
	private readonly now: () => number;

	constructor(spawnProcess: SpawnProcess = defaultSpawnProcess, now: () => number = Date.now) {
		this.spawnProcess = spawnProcess;
		this.now = now;
	}

	execute$(request: ProjectExecutionRequest): Observable<ProjectExecutionResult> {
		return new Observable(subscriber => {
			const capture = new ExecutionCapture({request, spawnProcess: this.spawnProcess, now: this.now, subscriber});
			capture.start();
			return () => capture.teardown();
		});
	}
}

interface ExecutionCaptureOptions {
	request: ProjectExecutionRequest;
	spawnProcess: SpawnProcess;
	now: () => number;
	subscriber: {next: (result: ProjectExecutionResult) => void; complete: () => void};
}

function getSpawnOptions(request: ProjectExecutionRequest): Parameters<SpawnProcess>['2'] {
	return {
		cwd: request.cwd,
		env: request.environment,
		shell: false,
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
		detached: false,
	};
}

export function buildProjectChildEnvironment(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
	return Object.fromEntries(Object.entries(source).filter(([key]) => isAllowedEnvironmentKey(key)));
}

function isAllowedEnvironmentKey(key: string): boolean {
	const normalizedKey = key.toUpperCase();
	return (
		[
			'PATH',
			'HOME',
			'USER',
			'LOGNAME',
			'SHELL',
			'USERPROFILE',
			'APPDATA',
			'LOCALAPPDATA',
			'PATHEXT',
			'SYSTEMROOT',
			'COMSPEC',
			'NODE_OPTIONS',
			'TMP',
			'TEMP',
			'TMPDIR',
			'HTTP_PROXY',
			'HTTPS_PROXY',
			'NO_PROXY',
			'NODE_EXTRA_CA_CERTS',
			'SSL_CERT_FILE',
			'SSL_CERT_DIR',
			'REQUESTS_CA_BUNDLE',
		].includes(normalizedKey) || isAllowedNpmConfigurationKey(normalizedKey)
	);
}

function isAllowedNpmConfigurationKey(normalizedKey: string): boolean {
	if (!normalizedKey.startsWith('NPM_CONFIG_')) {
		return false;
	}
	return [
		'REGISTRY',
		'PROXY',
		'HTTPS_PROXY',
		'NOPROXY',
		'CAFILE',
		'CERT',
		'STRICT_SSL',
		'USERCONFIG',
		'GLOBALCONFIG',
	].includes(normalizedKey.slice('NPM_CONFIG_'.length));
}
