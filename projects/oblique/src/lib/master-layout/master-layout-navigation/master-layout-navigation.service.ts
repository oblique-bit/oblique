import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues, ObEScrollMode} from '../master-layout.datatypes';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutNavigationService {
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private readonly _scrolled: Subject<number> = new Subject<number>();
	private readonly scrolled$ = this._scrolled.asObservable();
	private readonly _refreshed: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this._refreshed.asObservable();
	private _isFullWidth = this.config.navigation.isFullWidth;
	private _scrollMode = this.config.navigation.scrollMode;

	constructor(private readonly config: ObMasterLayoutConfig, translate: TranslateService) {
		translate.onLangChange.subscribe(() => this.refresh());
	}

	get isFullWidth() {
		return this._isFullWidth;
	}

	set isFullWidth(value: boolean) {
		this._isFullWidth = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.FULL_WIDTH,
			value: value
		});
	}

	get scrollMode() {
		return this._scrollMode;
	}

	set scrollMode(value: ObEScrollMode) {
		this._scrollMode = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.SCROLLABLE,
			mode: value
		});
	}

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return this.eventsS;
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	refresh() {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		setTimeout(() => this._refreshed.next());
	}

	scrollLeft(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		setTimeout(() => this._scrolled.next(-(offset || this.config.navigation.scrollDelta)));
	}

	scrollRight(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		setTimeout(() => this._scrolled.next(offset || this.config.navigation.scrollDelta));
	}
}
