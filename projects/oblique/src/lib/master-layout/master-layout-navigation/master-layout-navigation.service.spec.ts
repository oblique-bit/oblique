import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {WINDOW} from '../../window/window.provider';
import {ObMasterLayoutNavigationService} from './master-layout-navigation.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {ObEMasterLayoutEventValues, ObEScrollMode} from '../master-layout.model';

describe('MasterLayoutNavigationService', () => {
	let service: ObMasterLayoutNavigationService;
	let onLangChange$: Subject<void>;
	let opened$: Subject<boolean>;
	let resize$: Subject<UIEvent>;
	const translateMock = {
		get onLangChange() {
			return onLangChange$;
		},
	};
	const mockMasterLayout = {
		navigation: {isFullWidth: false, scrollDelta: 95, scrollMode: ObEScrollMode.AUTO},
	};
	beforeEach(() => {
		vi.useFakeTimers();
		onLangChange$ = new Subject<void>();
		opened$ = new Subject<boolean>();
		resize$ = new Subject<UIEvent>();
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutNavigationService,
				{provide: TranslateService, useValue: translateMock},
				{provide: ObMasterLayoutConfig, useValue: mockMasterLayout},
				{provide: ObMasterLayoutComponentService, useValue: {hasMainNavigation: true}},
				{provide: ObOffCanvasService, useValue: {opened$}},
				{provide: ObGlobalEventsService, useValue: {resize$}},
				{provide: WINDOW, useValue: window},
			],
		});
		service = TestBed.inject(ObMasterLayoutNavigationService);
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should emit scrolledLeft on scrollLeft call', () => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollLeft();
		vi.runOnlyPendingTimers();
		expect(emitted).toBe(true);
	});

	it('should emit scrolledRight on scrollRight call', () => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollRight();
		vi.runOnlyPendingTimers();
		expect(emitted).toBe(true);
	});

	it('should emit refreshed on refresh call', () => {
		let emitted = false;
		service.refreshed.subscribe(() => {
			emitted = true;
		});
		service.refresh();
		vi.runOnlyPendingTimers();
		expect(emitted).toBe(true);
	});

	describe('refresh', () => {
		it('should emit a refreshed event', () => {
			service.refreshed.subscribe(() => {
				expect(true).toBe(true);
			});
			service.refresh();
		});
	});

	it('should emit isFullWidth configuration changes', () => {
		const observer = vi.fn();
		service.configEvents$.subscribe(observer);

		service.isFullWidth = true;

		expect(observer).toHaveBeenCalledWith({name: ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH, value: true});
	});

	it('should emit scrollMode configuration changes', () => {
		const observer = vi.fn();
		service.configEvents$.subscribe(observer);

		service.scrollMode = ObEScrollMode.ENABLED;

		expect(observer).toHaveBeenCalledWith({
			name: ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE,
			mode: ObEScrollMode.ENABLED,
		});
	});

	it('should use the configured offset when scrolling left', () => {
		const observer = vi.fn();
		service.scrolled.subscribe(observer);

		service.scrollLeft(42);
		vi.runOnlyPendingTimers();

		expect(observer).toHaveBeenCalledWith(-42);
	});

	it('should use the configured offset when scrolling right', () => {
		const observer = vi.fn();
		service.scrolled.subscribe(observer);

		service.scrollRight(42);
		vi.runOnlyPendingTimers();

		expect(observer).toHaveBeenCalledWith(42);
	});

	it('should refresh on language changes', () => {
		const observer = vi.fn();
		service.refreshed.subscribe(observer);

		onLangChange$.next();
		vi.runOnlyPendingTimers();

		expect(observer).toHaveBeenCalled();
	});

	it('should refresh after the off canvas opens', () => {
		const observer = vi.fn();
		service.refreshed.subscribe(observer);

		opened$.next(true);
		vi.advanceTimersByTime(600);
		vi.runOnlyPendingTimers();

		expect(observer).toHaveBeenCalled();
	});

	it('should refresh on resize', () => {
		const observer = vi.fn();
		service.refreshed.subscribe(observer);

		resize$.next(new UIEvent('resize'));
		vi.runOnlyPendingTimers();

		expect(observer).toHaveBeenCalled();
	});
});
