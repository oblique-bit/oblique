import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MasterLayoutNavigationService} from './master-layout-navigation.service';
import {MasterLayoutService} from '../master-layout.service';

describe('MasterLayoutNavigationService', () => {
	const translateMock = {
		onLangChange : of()
	};
	const mockMasterLayout = {navigationScrollable: false};
	beforeEach(() => TestBed.configureTestingModule({
		providers: [
			{provide: TranslateService, useValue: translateMock},
			{provide: MasterLayoutService, useValue: mockMasterLayout}
		]
	}));

	it('should be created', () => {
		const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
		expect(service).toBeTruthy();
	});

	describe('with scrollable navigation enabled', () => {
		beforeEach(() => {
			mockMasterLayout.navigationScrollable = true;
		});

		it('should emit scrolledLeft on scrollLeft call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
			let emitted = false;
			service.scrolledLeft.subscribe(() => {
				emitted = true;
			});
			service.scrollLeft();
			tick(0);
			expect(emitted).toBe(true);
		}));

		it('should emit scrolledRight on scrollRight call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
			let emitted = false;
			service.scrolledRight.subscribe(() => {
				emitted = true;
			});
			service.scrollRight();
			tick(0);
			expect(emitted).toBe(true);
		}));

		it('should emit refreshed on refresh call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
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
			mockMasterLayout.navigationScrollable = false;
		});

		it('should not emit scrolledLeft on scrollLeft call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
			let emitted = false;
			service.scrolledLeft.subscribe(() => {
				emitted = true;
			});
			service.scrollLeft();
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should not emit scrolledRight on scrollRight call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
			let emitted = false;
			service.scrolledRight.subscribe(() => {
				emitted = true;
			});
			service.scrollRight();
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should not emit refreshed on refresh call', fakeAsync(() => {
			const service: MasterLayoutNavigationService = TestBed.get(MasterLayoutNavigationService);
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
