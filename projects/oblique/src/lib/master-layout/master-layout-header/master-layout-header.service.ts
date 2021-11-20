import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.model';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutHeaderService {
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isCustom = this.config.header.isCustom;
	private _isSmall = this.config.header.isSmall;
	private _isSticky = this.config.header.isSticky;
	private _reduceOnScroll = this.config.header.reduceOnScroll;

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
			name: ObEMasterLayoutEventValues.HEADER_IS_CUSTOM,
			value: value
		});
	}

	get isSmall(): boolean {
		return this._isSmall;
	}

	set isSmall(value: boolean) {
		this._isSmall = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_SMALL,
			value: value
		});
	}

	get isSticky(): boolean {
		return this._isSticky;
	}

	set isSticky(value: boolean) {
		this._isSticky = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_STICKY,
			value: value
		});
	}

	get reduceOnScroll(): boolean {
		return this._reduceOnScroll;
	}

	set reduceOnScroll(value: boolean) {
		this._reduceOnScroll = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_REDUCE_ON_SCROLL,
			value: value
		});
	}
}
