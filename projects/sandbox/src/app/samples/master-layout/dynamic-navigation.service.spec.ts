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

	test('should create the service', () => {
		expect(service).toBeTruthy();
	});

	describe(DynamicNavigationService.prototype.useCustomNavigation.name, () => {
		let links: Promise<ObINavigationLink[]>;
		beforeEach(() => {
			links = firstValueFrom(service.navigationLinks$);
			service.setNavigation([{label: 'test'}]);
		});

		test('should emit default navigation when false', async () => {
			service.useCustomNavigation(false);
			expect(await links).toEqual([{label: 'test'}]);
		});

		test('should emit an empty array when true', async () => {
			service.useCustomNavigation(true);
			expect(await links).toEqual([]);
		});
	});

	describe(DynamicNavigationService.prototype.addLink.name, () => {
		let links: Promise<ObINavigationLink[]>;
		beforeEach(() => {
			links = firstValueFrom(service.navigationLinks$);
			service.setNavigation([{label: 'test'}]);
		});

		test('should emit link with label', async () => {
			service.addLink({label: 'Label'});
			expect(await links).toEqual([{label: 'test'}, {label: 'Label', removable: true}]);
		});
	});

	describe('collapseBreakpoint', () => {
		test('should default to "md"', () => {
			expect(service.collapseBreakpoint()).toBe('md');
		});
	});
	describe(DynamicNavigationService.prototype.setNavigation.name, () => {
		test('should not emit on navigationLinks$', () => {
			const spy = jest.fn();
			service.navigationLinks$.subscribe(spy);
			service.setNavigation([{label: 'test'}]);
			expect(spy).not.toHaveBeenCalled();
		});
	});
	describe(DynamicNavigationService.prototype.removeLastLink.name, () => {
		let links: Promise<ObINavigationLink[]>;
		beforeEach(() => {
			service.setNavigation([{label: 'first'}, {label: 'second'}, {label: 'third'}]);
		});
		test('should emit links without the last element', async () => {
			links = firstValueFrom(service.navigationLinks$);
			service.removeLastLink();
			expect(await links).toEqual([{label: 'first'}, {label: 'second'}]);
		});
		test('should emit an empty array when called on a single link', async () => {
			service.setNavigation([{label: 'only'}]);
			links = firstValueFrom(service.navigationLinks$);
			service.removeLastLink();
			expect(await links).toEqual([]);
		});
	});
});
