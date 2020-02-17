import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {MasterLayoutConfig} from '../master-layout.config';
import {MasterLayoutEvent, MasterLayoutEventValues} from '../master-layout.utility';

@Injectable({
	providedIn: 'root'
})
export class MasterLayoutComponentService {
	private readonly _events = new Subject<MasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private _isMenuOpened = false;
	private _isFixed = this.config.layout.isFixed;
	private _hasCover = this.config.layout.hasCover;
	private _hasOffCanvas = this.config.layout.hasOffCanvas;
	private _hasMainNavigation = this.config.layout.hasMainNavigation;
	private _hasLayout = this.config.layout.hasLayout;

	constructor(private readonly config: MasterLayoutConfig) {
	}

	get configEvents(): Observable<MasterLayoutEvent> {
		return this.eventsS;
	}

	get isMenuOpened() {
		return this._isMenuOpened;
	}

	set isMenuOpened(value: boolean) {
		this._isMenuOpened = value;
		this._events.next({
			name: MasterLayoutEventValues.COLLAPSE,
			value: value
		});
	}

	get isFixed() {
		return this._isFixed;
	}

	set isFixed(value: boolean) {
		this._isFixed = value;
		this._events.next({
			name: MasterLayoutEventValues.FIXED,
			value: value
		});
	}

	get hasCover(): boolean {
		return this._hasCover;
	}

	set hasCover(value: boolean) {
		this._hasCover = value;
		this._events.next({
			name: MasterLayoutEventValues.COVER,
			value: value
		});
	}

	get hasOffCanvas(): boolean {
		return this._hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this._hasOffCanvas = value;
		this._events.next({
			name: MasterLayoutEventValues.OFF_CANVAS,
			value: value
		});
	}

	get hasMainNavigation(): boolean {
		return this._hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this._hasMainNavigation = value;
		this._events.next({
			name: MasterLayoutEventValues.MAIN_NAVIGATION,
			value: value
		});
	}

	get hasLayout(): boolean {
		return this._hasLayout;
	}

	set hasLayout(value: boolean) {
		this._hasLayout = value;
		this._events.next({
			name: MasterLayoutEventValues.LAYOUT,
			value: value
		});
	}
}
