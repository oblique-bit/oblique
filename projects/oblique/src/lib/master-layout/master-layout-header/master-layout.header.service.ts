import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MasterLayoutConfig} from '../master-layout.config';
import {MasterLayoutEvent, MasterLayoutEventValues} from '../master-layout.utility';


@Injectable({providedIn: 'root'})
export class MasterLayoutHeaderService {
	private readonly _events = new Subject<MasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isCustom = this.config.header.isCustom;
	private _isMedium = this.config.header.isMedium;
	private _isAnimated = this.config.header.isAnimated;
	private _isSticky = this.config.header.isSticky;
	private _hasScrollTransition = this.config.header.hasScrollTransitions;

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

	get isMedium(): boolean {
		return this._isMedium;
	}

	set isMedium(value: boolean) {
		this._isMedium = value;
		this._events.next({
			name: MasterLayoutEventValues.MEDIUM,
			value: value
		});
	}

	get isAnimated(): boolean {
		return this._isAnimated;
	}

	set isAnimated(value: boolean) {
		this._isAnimated = value;
		this._events.next({
			name: MasterLayoutEventValues.ANIMATE,
			value: value
		});
	}

	get isSticky(): boolean {
		return this._isSticky;
	}

	set isSticky(value: boolean) {
		this._isSticky = value;
		this._events.next({
			name: MasterLayoutEventValues.STICKY,
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
