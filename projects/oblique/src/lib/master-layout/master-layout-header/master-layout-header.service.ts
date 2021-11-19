import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.model';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutHeaderService {
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isCustom = this.config.header.isCustom;
	private _isMedium = this.config.header.isMedium;
	private _isSticky = this.config.header.isSticky;
	private _hasScrollTransition = this.config.header.hasScrollTransitions;

	constructor(private readonly config: ObMasterLayoutConfig) {}

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return this.eventsS;
	}

	get isCustom() {
		return this._isCustom;
	}

	set isCustom(value: boolean) {
		this._isCustom = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.CUSTOM,
			value: value
		});
	}

	get isMedium(): boolean {
		return this._isMedium;
	}

	set isMedium(value: boolean) {
		this._isMedium = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.MEDIUM,
			value: value
		});
	}

	get isSticky(): boolean {
		return this._isSticky;
	}

	set isSticky(value: boolean) {
		this._isSticky = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.STICKY,
			value: value
		});
	}

	get hasScrollTransition(): boolean {
		return this._hasScrollTransition;
	}

	set hasScrollTransition(value: boolean) {
		this._hasScrollTransition = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.SCROLL_TRANSITION,
			value: value
		});
	}
}
