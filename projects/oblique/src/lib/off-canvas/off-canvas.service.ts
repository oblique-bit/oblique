import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

/**
 * Service for controlling ObliqueUI offcanvas composite features.
 */
@Injectable({ providedIn: 'root' })
export class ObOffCanvasService {
	/**
	 * Fire an `opened` event
	 */
	get opened(): Observable<boolean> {
		return this.opened$;
	}

	get open(): boolean {
		return this.isOpen;
	}

	set open(value: boolean) {
		this.isOpen = value;
		this.openedSubject.next(this.isOpen);
	}

	private readonly openedSubject: Subject<boolean> = new Subject<boolean>();
	private readonly opened$ = this.openedSubject.asObservable();
	private isOpen = false;
}
