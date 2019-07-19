import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScrollingEvents {
	private readonly _scrolling = new Subject<boolean>();
	private readonly scrolling$ = this._scrolling.asObservable();
	private readonly _scrolled = new BehaviorSubject<number>(0);
	private readonly scrolled$ = this._scrolled.asObservable();

	get isScrolled(): Observable<boolean> {
		return this.scrolling$;
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	scrolling(isScrolling: boolean): void {
		this._scrolling.next(isScrolling);
	}

	hasScrolled(offset: number) {
		this._scrolled.next(offset);
	}
}
