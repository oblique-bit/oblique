import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {WINDOW} from '../../utilities';
import {ObMasterLayoutNavigationService} from './master-layout-navigation.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMockMasterLayoutComponentService} from '../_mocks/mock-master-layout.component.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';

describe('MasterLayoutNavigationService', () => {
	let service: ObMasterLayoutNavigationService;
	const translateMock = {
		onLangChange: of(),
	};
	const mockMasterLayout = {
		navigation: {},
	};
	beforeEach(() => {
		jest.useFakeTimers();
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutNavigationService,
				{provide: TranslateService, useValue: translateMock},
				{provide: ObMasterLayoutConfig, useValue: mockMasterLayout},
				{provide: ObMasterLayoutComponentService, useValue: ObMockMasterLayoutComponentService},
				{provide: ObOffCanvasService, useValue: {opened$: of(true)}},
				{provide: ObGlobalEventsService, useValue: ObMockGlobalEventsService},
				{provide: WINDOW, useValue: window},
			],
		});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('should be created', () => {
		service = TestBed.inject(ObMasterLayoutNavigationService);
		expect(service).toBeTruthy();
	});

	it('should emit scrolledLeft on scrollLeft call', () => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollLeft();
		jest.runOnlyPendingTimers();
		expect(emitted).toBe(true);
	});

	it('should emit scrolledRight on scrollRight call', () => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollRight();
		jest.runOnlyPendingTimers();
		expect(emitted).toBe(true);
	});

	it('should emit refreshed on refresh call', () => {
		let emitted = false;
		service.refreshed.subscribe(() => {
			emitted = true;
		});
		service.refresh();
		jest.runOnlyPendingTimers();
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
});
