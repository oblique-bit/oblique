import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export function obOutsideFilter(...elements: HTMLElement[]): (source$: Observable<Event>) => Observable<Event> {
	return source$ =>
		source$.pipe(
			filter(
				event => !(event.target instanceof Node) || elements.reduce((isOutside, element) => isOutside && !element.contains(event.target as Node), true)
			)
		);
}
