import {merge, Observable, of, partition} from 'rxjs';
import {filter, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObEScrollMode} from './master-layout.config';

export interface ObIMasterLayoutEvent {
	name: ObEMasterLayoutEventValues;
	value?: boolean;
	mode?: ObEScrollMode;
}

export enum ObEMasterLayoutEventValues {
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
	STICKY,
	LAYOUT
}

export function scrollEnabled(service: ObMasterLayoutHeaderService | ObMasterLayoutFooterService): <T>(source: Observable<T>) => Observable<T>  {
	const [enabled$, disabled$] = partition(
		merge(service.configEvents, of({
			name: ObEMasterLayoutEventValues.SCROLL_TRANSITION,
			value: service.hasScrollTransition
		})).pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.SCROLL_TRANSITION),
			shareReplay({refCount: true, bufferSize: 1})
		),
		(evt: ObIMasterLayoutEvent) => evt.value === true
	);

	return function <T>(source: Observable<T>): Observable<T> {
		return source.pipe(
			takeUntil(disabled$),
			repeatWhen(() => enabled$)
		);
	};
}
