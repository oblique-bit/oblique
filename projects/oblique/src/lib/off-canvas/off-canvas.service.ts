import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

/**
 * Service for controlling ObliqueUI offcanvas composite features.
 */
@Injectable({providedIn: 'root'})
export class ObOffCanvasService {
	/**
	 * Fire an `opened` event
	 */
	public readonly opened$: Observable<boolean>;

	private readonly openedSubject: Subject<boolean> = new Subject<boolean>();
	private isOpen = false;

	constructor() {
		this.opened$ = this.openedSubject.asObservable();
	}

	get open(): boolean {
		return this.isOpen;
	}

	set open(value: boolean) {
		this.isOpen = value;
		this.openedSubject.next(this.isOpen);
	}
}
