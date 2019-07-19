import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScrollingEvents {
	private readonly _scrolling = new Subject<boolean>();
	private readonly scrolling$ = this._scrolling.asObservable();

	get isScrolled(): Observable<boolean> {
		return this.scrolling$;
	}

	scrolling(isScrolling: boolean): void {
		this._scrolling.next(isScrolling);
	}
}
