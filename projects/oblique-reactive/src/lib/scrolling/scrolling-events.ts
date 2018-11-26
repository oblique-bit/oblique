import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
/**
 * Provides access to the scrolling events of the Scroll Detection directive.
 */
@Injectable({providedIn: 'root'})
export class ScrollingEvents {
	/**
	 * This will be feed with `scrolled` events
	 */
	public get scrolled(): Observable<boolean> {
		return this.scrolled$;
	}

	private readonly scrolledSubject: Subject<boolean> = new Subject<boolean>();
	private readonly scrolled$ = this.scrolledSubject.asObservable();

	/**
	 *
	 */
	public scroll(isScrolling: boolean): void {
		this.scrolledSubject.next(isScrolling);
	}
}
