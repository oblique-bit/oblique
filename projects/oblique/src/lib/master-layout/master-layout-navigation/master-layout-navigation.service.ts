import {Inject, Injectable} from '@angular/core';
import {Observable, Subject, merge} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {delay, filter} from 'rxjs/operators';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObEScrollMode, ObIMasterLayoutEvent} from '../master-layout.model';
import {WINDOW} from '../../utilities';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutNavigationService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly events = new Subject<ObIMasterLayoutEvent>();
	private readonly scrolledInternal: Subject<number> = new Subject<number>();
	private readonly scrolled$ = this.scrolledInternal.asObservable();
	private readonly refreshedInternal: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this.refreshedInternal.asObservable();
	private isFullWidthInternal = this.config.navigation.isFullWidth;
	private scrollModeInternal = this.config.navigation.scrollMode;

	constructor(
		private readonly config: ObMasterLayoutConfig,
		layoutService: ObMasterLayoutComponentService,
		globalEventsService: ObGlobalEventsService,
		offCanvas: ObOffCanvasService,
		translate: TranslateService,
		@Inject(WINDOW) private readonly window: Window
	) {
		merge(
			translate.onLangChange,
			offCanvas.opened$.pipe(delay(600)), // delay for the animation duration
			globalEventsService.resize$
		)
			.pipe(filter(() => layoutService.hasMainNavigation && this.scrollMode !== ObEScrollMode.DISABLED))
			.subscribe(() => this.refresh());
		this.configEvents$ = this.events.asObservable();
	}

	get isFullWidth(): boolean {
		return this.isFullWidthInternal;
	}

	set isFullWidth(value: boolean) {
		this.isFullWidthInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH,
			value
		});
	}

	get scrollMode(): ObEScrollMode {
		return this.scrollModeInternal;
	}

	set scrollMode(value: ObEScrollMode) {
		this.scrollModeInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE,
			mode: value
		});
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	refresh(): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this.refreshedInternal.next());
	}

	scrollLeft(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this.scrolledInternal.next(-(offset || this.config.navigation.scrollDelta)));
	}

	scrollRight(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this.scrolledInternal.next(offset || this.config.navigation.scrollDelta));
	}
}
