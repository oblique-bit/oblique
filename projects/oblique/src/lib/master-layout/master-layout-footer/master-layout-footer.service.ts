import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.model';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutFooterService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private _isCustom = this.config.footer.isCustom;
	private _isSticky = this.config.footer.isSticky;
	private _hasLogoOnScroll = this.config.footer.hasLogoOnScroll;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this._events.asObservable();
	}

	get isCustom() {
		return this._isCustom;
	}

	set isCustom(value: boolean) {
		this._isCustom = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM,
			value: value
		});
	}

	get isSticky(): boolean {
		return this._isSticky;
	}

	set isSticky(value: boolean) {
		this._isSticky = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.FOOTER_IS_STICKY,
			value: value
		});
	}

	get hasLogoOnScroll(): boolean {
		return this._hasLogoOnScroll;
	}

	set hasLogoOnScroll(value: boolean) {
		this._hasLogoOnScroll = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.FOOTER_HAS_LOGO_ON_SCROLL,
			value: value
		});
	}
}
