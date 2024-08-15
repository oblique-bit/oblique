import {StaticScript} from './static-script';

export class Timer extends StaticScript {
	private static readonly timers: Record<string, number> = {};
	private static readonly millisecondsPerSecond = 1000;
	private static readonly millisecondsPerMinute = 60000;

	static startTimer(id: string): void {
		Timer.timers[id] = performance.now();
	}

	static getTimerTime(id: string): string {
		return Timer.formatTime(performance.now() - Timer.timers[id]);
	}

	private static formatTime(time: number): string {
		if (time < Timer.millisecondsPerSecond) {
			return `${time.toFixed(2)}ms`;
		}
		if (time < Timer.millisecondsPerMinute) {
			return `${(time / Timer.millisecondsPerSecond).toFixed(2)}s`;
		}
		return `${(time / Timer.millisecondsPerMinute).toFixed(2)}m`;
	}
}
