import {TestBed} from '@angular/core/testing';
import {DynamicNavigationService} from './dynamic-navigation.service';
import {firstValueFrom} from 'rxjs';
import type {ObINavigationLink} from '@oblique/oblique';

describe(DynamicNavigationService.name, () => {
	let service: DynamicNavigationService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [DynamicNavigationService],
		}).compileComponents();

		service = TestBed.inject(DynamicNavigationService);
	});

	it('should create the service', () => {
		expect(service).toBeTruthy();
	});

	describe(DynamicNavigationService.prototype.useCustomNavigation.name, () => {
		let links: Promise<ObINavigationLink[]>;
		beforeEach(() => {
			links = firstValueFrom(service.navigationLinks$);
			service.setNavigation([{label: 'test'}]);
		});

		it('should emit default navigation when false', async () => {
			service.useCustomNavigation(false);
			expect(await links).toEqual([{label: 'test'}]);
		});
		it('should emit an empty array when true', async () => {
			service.useCustomNavigation(true);
			expect(await links).toEqual([]);
		});
	});
});
