import {fakeAsync, TestBed, tick} from '@angular/core/testing';
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
		onLangChange: of()
	};
	const mockMasterLayout = {
		navigation: {}
	};
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutNavigationService,
				{provide: TranslateService, useValue: translateMock},
				{provide: ObMasterLayoutConfig, useValue: mockMasterLayout},
				{provide: ObMasterLayoutComponentService, useValue: ObMockMasterLayoutComponentService},
				{provide: ObOffCanvasService, useValue: {opened: of(true)}},
				{provide: ObGlobalEventsService, useValue: ObMockGlobalEventsService},
				{provide: WINDOW, useValue: window}
			]
		})
	);

	it('should be created', () => {
		service = TestBed.inject(ObMasterLayoutNavigationService);
		expect(service).toBeTruthy();
	});

	it('should emit scrolledLeft on scrollLeft call', fakeAsync(() => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollLeft();
		tick(0);
		expect(emitted).toBe(true);
	}));

	it('should emit scrolledRight on scrollRight call', fakeAsync(() => {
		let emitted = false;
		service.scrolled.subscribe(() => {
			emitted = true;
		});
		service.scrollRight();
		tick(0);
		expect(emitted).toBe(true);
	}));

	it('should emit refreshed on refresh call', fakeAsync(() => {
		let emitted = false;
		service.refreshed.subscribe(() => {
			emitted = true;
		});
		service.refresh();
		tick(0);
		expect(emitted).toBe(true);
	}));

	describe('refresh', () => {
		it('should emit a refreshed event', () => {
			service.refreshed.subscribe(() => {
				expect(true).toBe(true);
			});
			service.refresh();
		});
	});
});
