import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ObScrollingEvents {
	private readonly scrollingInternal = new Subject<boolean>();
	private readonly scrolling$ = this.scrollingInternal.asObservable();
	private readonly scrolledInternal = new BehaviorSubject<number>(0);
	private readonly scrolled$ = this.scrolledInternal.asObservable();

	get isScrolled(): Observable<boolean> {
		return this.scrolling$;
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	scrolling(isScrolling: boolean): void {
		this.scrollingInternal.next(isScrolling);
	}

	hasScrolled(offset: number): void {
		this.scrolledInternal.next(offset);
	}
}
