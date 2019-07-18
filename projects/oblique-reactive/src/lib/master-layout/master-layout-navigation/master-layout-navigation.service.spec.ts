import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MasterLayoutNavigationService} from './master-layout-navigation.service';
import {MasterLayoutConfig} from 'oblique-reactive';

describe('MasterLayoutNavigationService', () => {
	let service: MasterLayoutNavigationService;
	const translateMock = {
		onLangChange : of()
	};
	const mockMasterLayout = {
		navigation: {}
	};
	beforeEach(() => TestBed.configureTestingModule({
		providers: [
			{provide: TranslateService, useValue: translateMock},
			{provide: MasterLayoutConfig, useValue: mockMasterLayout}
		]
	}));

	it('should be created', () => {
		service = TestBed.get(MasterLayoutNavigationService);
		expect(service).toBeTruthy();
	});

	describe('with scrollable navigation enabled', () => {
		beforeEach(() => {
			service = TestBed.get(MasterLayoutNavigationService);
			service.isScrollable = true;
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
	});

	describe('with scrollable navigation disabled', () => {
		beforeEach(() => {
			service = TestBed.get(MasterLayoutNavigationService);
			service.isScrollable = false;
		});

		it('should not emit scrolledLeft on scrollLeft call', fakeAsync(() => {
			let emitted = false;
			service.scrolled.subscribe(() => {
				emitted = true;
			});
			service.scrollLeft();
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should not emit scrolledRight on scrollRight call', fakeAsync(() => {
			let emitted = false;
			service.scrolled.subscribe(() => {
				emitted = true;
			});
			service.scrollRight();
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should not emit refreshed on refresh call', fakeAsync(() => {
			let emitted = false;
			service.refreshed.subscribe(() => {
				emitted = true;
			});
			service.refresh();
			tick(0);
			expect(emitted).toBe(false);
		}));
	});
});
