import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export function obOutsideFilter<T extends Event>(...elements: HTMLElement[]): (source$: Observable<T>) => Observable<T> {
	return source$ =>
		source$.pipe(
			filter(
				event =>
					// prettier-ignore
					!(event.target instanceof Node)
					|| elements.reduce((isOutside, element) => isOutside && !element.contains(event.target as Node), true)
			)
		);
}
