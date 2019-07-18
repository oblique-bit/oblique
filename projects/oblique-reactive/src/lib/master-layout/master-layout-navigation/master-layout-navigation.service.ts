import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {Unsubscribable} from '../../unsubscribe.class';
import {MasterLayoutEvent, MasterLayoutEventValues} from '../master-layout.utility';
import {MasterLayoutConfig} from '../master-layout.config';

@Injectable({
	providedIn: 'root'
})
export class MasterLayoutNavigationService extends Unsubscribable {
	private readonly _events = new Subject<MasterLayoutEvent>();
	private readonly eventsS = this._events.asObservable();
	private readonly _scrolled: Subject<number> = new Subject<number>();
	private readonly scrolled$ = this._scrolled.asObservable();
	private readonly _refreshed: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this._refreshed.asObservable();
	private _isFullWidth = this.config.navigation.isFullWidth;
	private _isScrollable = this.config.navigation.isScrollable;

	constructor(private readonly config: MasterLayoutConfig, translate: TranslateService) {
		super();
		translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.refresh());
	}


	get isFullWidth() {
		return this._isFullWidth;
	}

	set isFullWidth(value: boolean) {
		this._isFullWidth = value;
		this._events.next({
			name: MasterLayoutEventValues.FULL_WIDTH,
			value: value
		});
	}

	get isScrollable() {
		return this._isScrollable;
	}

	set isScrollable(value: boolean) {
		this._isScrollable = value;
		this._events.next({
			name: MasterLayoutEventValues.SCROLLABLE,
			value: value
		});
	}

	get configEvents(): Observable<MasterLayoutEvent> {
		return this.eventsS;
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	refresh() {
		if (this.isScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this._refreshed.next());
		}
	}

	scrollLeft(offset?: number): void {
		if (this.isScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this._scrolled.next(-(offset || this.config.navigation.scrollDelta)));
		}
	}

	scrollRight(offset?: number): void {
		if (this.isScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this._scrolled.next(offset || this.config.navigation.scrollDelta));
		}
	}
}
