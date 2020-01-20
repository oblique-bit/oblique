import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
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
