import {Observable, partition} from 'rxjs';
import {filter, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';

export interface MasterLayoutEvent {
	name: MasterLayoutEventValues;
	value: boolean;
}

export enum MasterLayoutEventValues {
	ANIMATE,
	COLLAPSE,
	COVER,
	CUSTOM,
	FIXED,
	FULL_WIDTH,
	OFF_CANVAS,
	MEDIUM,
	MAIN_NAVIGATION,
	SMALL,
	SCROLL_TRANSITION,
	SCROLLABLE,
	STICKY
}

export function scrollEnabled(events: Observable<MasterLayoutEvent>) {
	const [enabled$, disabled$] = partition(
		events.pipe(
			filter((evt: MasterLayoutEvent) => evt.name === MasterLayoutEventValues.SCROLL_TRANSITION),
			shareReplay({refCount: true, bufferSize: 1})
		),
		(evt: MasterLayoutEvent) => evt.value === true
	);

	return function <T>(source: Observable<T>): Observable<T> {
		return source.pipe(
			takeUntil(disabled$),
			repeatWhen(() => enabled$)
		);
	};
}
