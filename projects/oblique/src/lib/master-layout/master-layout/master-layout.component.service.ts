import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.model';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutComponentService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private _isMenuOpened = false;
	private _hasCover = this.config.layout.hasCover;
	private _hasOffCanvas = this.config.layout.hasOffCanvas;
	private _hasMainNavigation = this.config.layout.hasMainNavigation;
	private _hasLayout = this.config.layout.hasLayout;
	private _hasMaxWidth = this.config.layout.hasMaxWidth;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this._events.asObservable();
	}

	get isMenuOpened() {
		return this._isMenuOpened;
	}

	set isMenuOpened(value: boolean) {
		this._isMenuOpened = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.IS_MENU_OPENED,
			value: value
		});
	}

	get hasCover(): boolean {
		return this._hasCover;
	}

	set hasCover(value: boolean) {
		this._hasCover = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_COVER,
			value: value
		});
	}

	get hasOffCanvas(): boolean {
		return this._hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this._hasOffCanvas = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_OFF_CANVAS,
			value: value
		});
	}

	get hasMainNavigation(): boolean {
		return this._hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this._hasMainNavigation = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION,
			value: value
		});
	}

	get hasLayout(): boolean {
		return this._hasLayout;
	}

	set hasLayout(value: boolean) {
		this._hasLayout = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_DEFAULT_LAYOUT,
			value: value
		});
	}

	get hasMaxWidth(): boolean {
		return this._hasMaxWidth;
	}

	set hasMaxWidth(value: boolean) {
		this._hasMaxWidth = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAX_WIDTH,
			value: value
		});
	}
}
