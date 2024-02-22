import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockScrollingEvents {
	get isScrolled(): Observable<boolean> {
		return of(true);
	}

	get scrolled(): Observable<number> {
		return of(0);
	}

	scrolling(isScrolling: boolean): void {}

	hasScrolled(offset: number): void {}
}
