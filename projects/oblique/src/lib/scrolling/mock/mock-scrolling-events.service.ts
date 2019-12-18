import {Observable, of} from 'rxjs';

export class MockScrollingEvents {

	get isScrolled(): Observable<boolean> {
		return of(true);
	}

	get scrolled(): Observable<number> {
		return of(0);
	}

	scrolling(isScrolling: boolean): void {
	}

	hasScrolled(offset: number): void {
	}
}
