export interface ObWindow {
	confirm: (message: string) => boolean;
	history: Pick<History, 'length'>;
	innerHeight: number;
	innerWidth: number;
	localStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
	location: Pick<Location, 'href' | 'host' | 'origin'>;
	matchMedia: (query: string) => Pick<MediaQueryList, 'matches'>;
	open: (url?: string, target?: string, features?: string) => Window | null;
	pageYOffset: number;
	setInterval: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
	setTimeout: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
}
