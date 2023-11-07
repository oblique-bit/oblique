import {Observable, ReplaySubject, merge, of, partition, share} from 'rxjs';
import {filter, repeat, takeUntil} from 'rxjs/operators';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from './master-layout.model';

export function scrollEnabled(service: ObMasterLayoutHeaderService): <T>(source: Observable<T>) => Observable<T> {
	const [enabled$, disabled$] = partition(
		merge(
			service.configEvents$,
			of({
				name: ObEMasterLayoutEventValues.HEADER_REDUCE_ON_SCROLL,
				value: service.reduceOnScroll
			})
		).pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_REDUCE_ON_SCROLL),
			share({connector: () => new ReplaySubject(1)})
		),
		(evt: ObIMasterLayoutEvent) => evt.value
	);

	return function <T>(source: Observable<T>): Observable<T> {
		return source.pipe(takeUntil(disabled$), repeat({delay: () => enabled$}));
	};
}
