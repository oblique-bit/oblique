import {Observable, fromEvent, partition, takeUntil} from 'rxjs';
import {repeat} from 'rxjs/operators';

export function obPauseWhenPageHidden<T>(doc = document): (source$: Observable<T>) => Observable<T> {
	const [stop$, start$] = partition(fromEvent(doc, 'visibilitychange'), () => doc.visibilityState === 'hidden');
	return source$ => source$.pipe(takeUntil(stop$), repeat({delay: () => start$}));
}
