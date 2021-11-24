import {TestBed} from '@angular/core/testing';
import {DOCUMENT} from '@angular/common';
import {ObThemeService} from './theme.service';

describe('ObThemeService', () => {
	jest.spyOn(console, 'warn');
	let service: ObThemeService;

	describe('With neither Material nor Bootstrap CSS', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({});
			service = TestBed.inject(ObThemeService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should provide "Unknown" as current theme', () => {
			expect(service.theme).toBe('Unknown');
		});

		describe('deprecated', () => {
			it('should do nothing', () => {
				service.deprecated('', '');
				expect(console.warn).not.toHaveBeenCalled();
			});
		});
	});

	describe('With Material CSS', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{provide: DOCUMENT, useValue: {styleSheets: [{href: 'styles.asdfghjklqwertzuiopy.css', rules: [{selectorText: '.ob-material-telemetry'}]}]}}
				]
			});

			service = TestBed.inject(ObThemeService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should provide "Material" as current theme', () => {
			expect(service.theme).toBe('Material');
		});

		describe('deprecated', () => {
			it('should show a warning', () => {
				service.deprecated('component', 'target');
				expect(console.warn).toHaveBeenCalledWith(
					`Oblique's "component" should not be used with Material Design, prefer the Angular implementation:\n\t\t\thttps://material.angular.io/components/target.`
				);
			});

			it('should show a warning only once', () => {
				service.deprecated('component', 'target');
				service.deprecated('component', 'target');
				expect(console.warn).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('With Bootstrap CSS', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{
						provide: DOCUMENT,
						useValue: {styleSheets: [{href: 'styles.asdfghjklqwertzuiopy.css', rules: [{selectorText: '.ob-bootstrap-telemetry'}]}]}
					}
				]
			});

			service = TestBed.inject(ObThemeService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should provide "Bootstrap" as current theme', () => {
			expect(service.theme).toBe('Bootstrap');
		});

		describe('deprecated', () => {
			it('should do nothing', () => {
				service.deprecated('', '');
				expect(console.warn).not.toHaveBeenCalled();
			});
		});
	});

	describe('With bad css name', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{provide: DOCUMENT, useValue: {styleSheets: [{href: 'styles.css', rules: [{selectorText: '.ob-bootstrap-telemetry'}]}]}}]
			});

			service = TestBed.inject(ObThemeService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should provide "Unknown" as current theme', () => {
			expect(service.theme).toBe('Unknown');
		});

		describe('deprecated', () => {
			it('should do nothing', () => {
				service.deprecated('', '');
				expect(console.warn).not.toHaveBeenCalled();
			});
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
});
