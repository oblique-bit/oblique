import {merge, Observable, of, partition} from 'rxjs';
import {filter, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from './master-layout.model';

export function scrollEnabled(service: ObMasterLayoutHeaderService): <T>(source: Observable<T>) => Observable<T> {
	const [enabled$, disabled$] = partition(
		merge(
			service.configEvents,
			of({
				name: ObEMasterLayoutEventValues.SCROLL_TRANSITION,
				value: service.hasScrollTransition
			})
		).pipe(
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
