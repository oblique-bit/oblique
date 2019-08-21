import {merge, Observable, of, partition} from 'rxjs';
import {filter, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';
import {MasterLayoutHeaderService} from './master-layout-header/master-layout.header.service';
import {MasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';

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

export function scrollEnabled(service: MasterLayoutHeaderService | MasterLayoutFooterService): <T>(source: Observable<T>) => Observable<T>  {
	const [enabled$, disabled$] = partition(
		merge(service.configEvents, of({
			name: MasterLayoutEventValues.SCROLL_TRANSITION,
			value: service.hasScrollTransition
		})).pipe(
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
