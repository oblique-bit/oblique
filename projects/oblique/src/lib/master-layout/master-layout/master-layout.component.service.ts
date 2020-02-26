import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.utility';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutComponentService {
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isMenuOpened = false;
	private _isFixed = this.config.layout.isFixed;
	private _hasCover = this.config.layout.hasCover;
	private _hasOffCanvas = this.config.layout.hasOffCanvas;
	private _hasMainNavigation = this.config.layout.hasMainNavigation;
	private _hasLayout = this.config.layout.hasLayout;

	constructor(private readonly config: ObMasterLayoutConfig) {
	}

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return this.eventsS;
	}

	get isMenuOpened() {
		return this._isMenuOpened;
	}

	set isMenuOpened(value: boolean) {
		this._isMenuOpened = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.COLLAPSE,
			value: value
		});
	}

	get isFixed() {
		return this._isFixed;
	}

	set isFixed(value: boolean) {
		this._isFixed = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.FIXED,
			value: value
		});
	}

	get hasCover(): boolean {
		return this._hasCover;
	}

	set hasCover(value: boolean) {
		this._hasCover = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.COVER,
			value: value
		});
	}

	get hasOffCanvas(): boolean {
		return this._hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this._hasOffCanvas = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.OFF_CANVAS,
			value: value
		});
	}

	get hasMainNavigation(): boolean {
		return this._hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this._hasMainNavigation = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.MAIN_NAVIGATION,
			value: value
		});
	}

	get hasLayout(): boolean {
		return this._hasLayout;
	}

	set hasLayout(value: boolean) {
		this._hasLayout = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT,
			value: value
		});
	}
}
