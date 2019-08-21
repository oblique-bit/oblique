import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {MasterLayoutConfig} from '../master-layout.config';
import {MasterLayoutEvent, MasterLayoutEventValues} from '../master-layout.utility';

@Injectable({
	providedIn: 'root'
})
export class MasterLayoutFooterService {
	private readonly _events = new Subject<MasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isCustom = this.config.footer.isCustom;
	private _isSmall = this.config.footer.isSmall;
	private _hasScrollTransition = this.config.footer.hasScrollTransitions;

	constructor(private readonly config: MasterLayoutConfig) {
	}

	get configEvents(): Observable<MasterLayoutEvent> {
		return this.eventsS;
	}

	get isCustom() {
		return this._isCustom;
	}

	set isCustom(value: boolean) {
		this._isCustom = value;
		this._events.next({
			name: MasterLayoutEventValues.CUSTOM,
			value: value
		});
	}

	get isSmall(): boolean {
		return this._isSmall;
	}

	set isSmall(value: boolean) {
		this._isSmall = value;
		this._events.next({
			name: MasterLayoutEventValues.SMALL,
			value: value
		});
	}

	get hasScrollTransition(): boolean {
		return this._hasScrollTransition;
	}

	set hasScrollTransition(value: boolean) {
		this._hasScrollTransition = value;
		this._events.next({
			name: MasterLayoutEventValues.SCROLL_TRANSITION,
			value: value
		});
	}
}
