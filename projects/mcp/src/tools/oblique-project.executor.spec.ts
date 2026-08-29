/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 injected project executor tests
 */

import {PassThrough} from 'node:stream';
import {firstValueFrom} from 'rxjs';
import {
	NodeProjectExecutor,
	type ProjectChildProcess,
	type ProjectExecutionRequest,
	type SpawnProcess,
	buildProjectChildEnvironment,
	maximumProjectOutputLength,
	sanitizeProjectOutput,
} from './oblique-project.executor.js';

const request: ProjectExecutionRequest = {
	executable: 'npx',
	args: [
		'--yes',
		'@oblique/cli@15.4.4',
		'new',
		'employee-portal',
		'--applicationOperator=Federal Test Office',
		'--contact=accessibility@example.test',
		'--npmrc',
	],
	cwd: '/workspace',
	environment: {PATH: '/bin'},
};

class FakeChild implements ProjectChildProcess {
	readonly stdout = new PassThrough();
	readonly stderr = new PassThrough();
	readonly kill = jest.fn(() => true);
	private readonly listeners = new Map<string, ((...values: unknown[]) => void)[]>();

	once(event: 'error' | 'exit' | 'close', listener: (...values: unknown[]) => void): ProjectChildProcess {
		this.listeners.set(event, [...(this.listeners.get(event) ?? []), listener]);
		return this;
	}

	removeListener(event: 'error' | 'exit' | 'close', listener: (...values: unknown[]) => void): ProjectChildProcess {
		this.listeners.set(
			event,
			(this.listeners.get(event) ?? []).filter(registered => registered !== listener)
		);
		return this;
	}

	emit(event: 'error' | 'exit' | 'close', ...values: unknown[]): void {
		for (const listener of this.listeners.get(event) ?? []) {
			listener(...values);
		}
	}

	listenerCount(event: 'error' | 'exit' | 'close'): number {
		return this.listeners.get(event)?.length ?? 0;
	}
}

describe('NodeProjectExecutor', () => {
	it('can be constructed with the internal production defaults without executing them', () => {
		expect(new NodeProjectExecutor()).toBeInstanceOf(NodeProjectExecutor);
		expect(buildProjectChildEnvironment()).toEqual(expect.any(Object));
	});

	it('spawns only the supplied canonical executable and arguments with a shell-free configuration', async () => {
		const child = new FakeChild();
		const spawnProcess = jest.fn<ReturnType<SpawnProcess>, Parameters<SpawnProcess>>(() => child);
		const executor = new NodeProjectExecutor(spawnProcess, () => 100);
		const execution = executor.execute$(request);
		expect(spawnProcess).not.toHaveBeenCalled();
		const result = firstValueFrom(execution);
		child.stdout.write('created');
		child.stderr.write('warning');
		child.emit('close', 0);

		await expect(result).resolves.toEqual({
			exitCode: 0,
			signal: null,
			stdout: 'created',
			stderr: 'warning',
			outputTruncated: false,
			timedOut: false,
			cancelled: false,
			durationMs: 0,
		});
		expect(spawnProcess).toHaveBeenCalledWith(request.executable, request.args, {
			cwd: request.cwd,
			env: request.environment,
			shell: false,
			stdio: ['ignore', 'pipe', 'pipe'],
			windowsHide: true,
			detached: false,
		});
	});

	it('retains a terminating signal from close metadata', async () => {
		const child = new FakeChild();
		const result = firstValueFrom(new NodeProjectExecutor(() => child).execute$(request));
		child.emit('close', null, 'SIGTERM');
		await expect(result).resolves.toMatchObject({exitCode: null, signal: 'SIGTERM'});
	});

	it('bounds captured child output before returning it', async () => {
		const child = new FakeChild();
		const execution = firstValueFrom(new NodeProjectExecutor(() => child).execute$(request));
		child.stdout.write('a'.repeat(maximumProjectOutputLength + 1));
		child.emit('close', 0);
		await expect(execution).resolves.toMatchObject({
			stdout: 'a'.repeat(maximumProjectOutputLength),
			outputTruncated: true,
		});
	});

	it('reports synchronous spawn errors and cancellation without shell execution', async () => {
		const failedExecutor = new NodeProjectExecutor(() => {
			throw new Error('not found');
		});
		await expect(firstValueFrom(failedExecutor.execute$(request))).resolves.toMatchObject({
			exitCode: null,
			stderr: 'Unable to start the Oblique CLI.',
		});

		const child = new FakeChild();
		const controller = new AbortController();
		const execution = firstValueFrom(
			new NodeProjectExecutor(() => child).execute$({...request, signal: controller.signal})
		);
		controller.abort();
		child.emit('close', null);
		await expect(execution).resolves.toMatchObject({exitCode: null, cancelled: true});
		expect(child.kill).toHaveBeenCalledWith('SIGTERM');
	});

	it('settles event races once and removes timers, signal handlers, and output handlers', async () => {
		jest.useFakeTimers();
		const timedChild = new FakeChild();
		const timeoutController = new AbortController();
		const timedExecution = firstValueFrom(
			new NodeProjectExecutor(() => timedChild).execute$({
				...request,
				timeoutMilliseconds: 1,
				signal: timeoutController.signal,
			})
		);
		jest.advanceTimersByTime(1);
		timeoutController.abort();
		timedChild.emit('close', null);
		await expect(timedExecution).resolves.toMatchObject({timedOut: true, exitCode: null});
		jest.runOnlyPendingTimers();
		expect(timedChild.kill).not.toHaveBeenCalledWith('SIGKILL');
		expect(timedChild.listenerCount('close')).toBe(0);
		jest.useRealTimers();

		const errorChild = new FakeChild();
		const errorExecution = firstValueFrom(new NodeProjectExecutor(() => errorChild).execute$(request));
		errorChild.emit('error', new Error('spawn error'));
		errorChild.emit('exit', 1);
		errorChild.emit('close', 0);
		await expect(errorExecution).resolves.toMatchObject({exitCode: null});
		expect(errorChild.listenerCount('error')).toBe(0);

		const duplicateTerminalChild = new FakeChild();
		jest.spyOn(duplicateTerminalChild, 'removeListener').mockImplementation(() => duplicateTerminalChild);
		const duplicateTerminal = firstValueFrom(new NodeProjectExecutor(() => duplicateTerminalChild).execute$(request));
		duplicateTerminalChild.emit('error', new Error('spawn error'));
		duplicateTerminalChild.emit('close', 0);
		await expect(duplicateTerminal).resolves.toMatchObject({exitCode: null});

		const abortedChild = new FakeChild();
		const abortedController = new AbortController();
		abortedController.abort();
		const abortedExecution = firstValueFrom(
			new NodeProjectExecutor(() => abortedChild).execute$({
				...request,
				signal: abortedController.signal,
			})
		);
		abortedChild.emit('close', null);
		await expect(abortedExecution).resolves.toMatchObject({cancelled: true});
		abortedController.abort();
		expect(abortedChild.kill).toHaveBeenCalledTimes(1);

		const exitedChild = new FakeChild();
		const exitedExecution = firstValueFrom(new NodeProjectExecutor(() => exitedChild).execute$(request));
		exitedChild.emit('exit', 0);
		exitedChild.emit('close', 0);
		await expect(exitedExecution).resolves.toMatchObject({exitCode: 0});
	});

	it('escalates termination only while a timed-out child remains open', async () => {
		jest.useFakeTimers();
		const child = new FakeChild();
		const execution = firstValueFrom(
			new NodeProjectExecutor(() => child).execute$({...request, timeoutMilliseconds: 1})
		);
		jest.advanceTimersByTime(1 + 5_000);
		expect(child.kill).toHaveBeenCalledWith('SIGTERM');
		expect(child.kill).toHaveBeenCalledWith('SIGKILL');
		child.emit('close', null);
		await expect(execution).resolves.toMatchObject({timedOut: true});
		jest.useRealTimers();
	});

	it('terminates and cleans up an unsubscribed execution without a later forced kill', () => {
		jest.useFakeTimers();
		const child = new FakeChild();
		const subscription = new NodeProjectExecutor(() => child).execute$(request).subscribe();

		subscription.unsubscribe();
		expect(child.kill).toHaveBeenCalledWith('SIGTERM');
		expect(jest.getTimerCount()).toBe(0);
		expect(child.listenerCount('error')).toBe(0);
		expect(child.listenerCount('close')).toBe(0);
		jest.runOnlyPendingTimers();
		expect(child.kill).not.toHaveBeenCalledWith('SIGKILL');
		jest.useRealTimers();
	});

	it('ignores close-before-timeout and late abort/error events after settlement', async () => {
		jest.useFakeTimers();
		const child = new FakeChild();
		const controller = new AbortController();
		const result = firstValueFrom(
			new NodeProjectExecutor(() => child).execute$({...request, timeoutMilliseconds: 1, signal: controller.signal})
		);

		child.emit('close', 0);
		controller.abort();
		child.emit('error', new Error('late error'));
		jest.advanceTimersByTime(5_001);
		await expect(result).resolves.toMatchObject({exitCode: 0, timedOut: false, cancelled: false});
		expect(child.kill).not.toHaveBeenCalled();
		expect(child.listenerCount('error')).toBe(0);
		expect(jest.getTimerCount()).toBe(0);
		jest.useRealTimers();
	});

	it('settles safely when SIGTERM or SIGKILL throws during cancellation', async () => {
		const termChild = new FakeChild();
		termChild.kill.mockImplementation(() => {
			throw new Error('terminated');
		});
		const controller = new AbortController();
		const terminated = firstValueFrom(
			new NodeProjectExecutor(() => termChild).execute$({...request, signal: controller.signal})
		);
		controller.abort();
		await expect(terminated).resolves.toMatchObject({cancelled: true, exitCode: null});

		jest.useFakeTimers();
		const killChild = new FakeChild();
		killChild.kill.mockReturnValueOnce(true).mockImplementationOnce(() => {
			throw new Error('forced termination failed');
		});
		const killed = firstValueFrom(
			new NodeProjectExecutor(() => killChild).execute$({...request, timeoutMilliseconds: 1})
		);
		jest.advanceTimersByTime(1 + 5_000);
		await expect(killed).resolves.toMatchObject({timedOut: true, exitCode: null});
		jest.useRealTimers();
	});

	it('keeps only the child environment allowlist and redacts bounded output', () => {
		expect(
			buildProjectChildEnvironment({
				path: '/bin',
				Http_Proxy: 'https://proxy',
				nPm_CoNfIg_ReGiStRy: 'https://registry',
				NPM_CONFIG__AUTHTOKEN: 'secret',
				GITHUB_TOKEN: 'secret',
				API_KEY: 'secret',
			})
		).toEqual({path: '/bin', Http_Proxy: 'https://proxy', nPm_CoNfIg_ReGiStRy: 'https://registry'});

		const redacted = sanitizeProjectOutput(
			'Bearer token-value _authToken=token npm_token: other https://user:password@example.test'
		);
		expect(redacted.value).not.toMatch(/token-value|password/iu);
		const output = sanitizeProjectOutput('a'.repeat(maximumProjectOutputLength + 1));
		expect(output).toMatchObject({truncated: true});
		expect(Buffer.byteLength(sanitizeProjectOutput('é'.repeat(maximumProjectOutputLength)).value)).toBeLessThanOrEqual(
			maximumProjectOutputLength
		);
		expect(
			Buffer.byteLength(sanitizeProjectOutput(`${'é'.repeat(maximumProjectOutputLength / 2)}a`).value)
		).toBeLessThanOrEqual(maximumProjectOutputLength);
	});

	it('preserves platform user and npm configuration keys case-insensitively', () => {
		expect(
			buildProjectChildEnvironment({
				HOME: '/home/user',
				user: 'user',
				LOGNAME: 'user',
				shell: '/bin/sh',
				npm_config_userconfig: '/tmp/npmrc',
				SECRET_TOKEN: 'x',
			})
		).toEqual({
			HOME: '/home/user',
			user: 'user',
			LOGNAME: 'user',
			shell: '/bin/sh',
			npm_config_userconfig: '/tmp/npmrc',
		});
	});

	it('combines split output chunks before redaction can inspect them', async () => {
		const child = new FakeChild();
		const execution = firstValueFrom(new NodeProjectExecutor(() => child).execute$(request));
		child.stdout.write('_auth');
		child.stdout.write('Token=secret-value');
		child.emit('close', 0);
		const result = await execution;

		expect(sanitizeProjectOutput(result.stdout).value).toContain('_authToken=[REDACTED]');
		expect(sanitizeProjectOutput(result.stdout).value).not.toContain('secret-value');
	});
});
