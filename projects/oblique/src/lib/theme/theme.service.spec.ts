import {TestBed} from '@angular/core/testing';
import {FONTS, ObThemeService, THEMES} from './theme.service';
import {DOCUMENT} from '@angular/common';

describe('ObThemeService', () => {
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

		describe('setTheme', () => {
			it('isMaterial should be true if fed with material', () => {
				service.setTheme(THEMES.MATERIAL);
				expect(service.isMaterial()).toBe(true);
			});

			it('isMaterial should be false if fed with BOOTSTRAP', () => {
				service.setTheme(THEMES.BOOTSTRAP);
				expect(service.isMaterial()).toBe(false);
			});

			it('theme$ should emit the last given theme', done => {
				service.setTheme(THEMES.MATERIAL);
				service.theme$.subscribe(theme => {
					expect(theme).toBe(THEMES.MATERIAL);
					done();
				});
			});
		});

		describe('setFont', () => {
			it('font$ should emit the last given font', done => {
				service.setFont(FONTS.ROBOTO);
				service.font$.subscribe(font => {
					expect(font).toBe(FONTS.ROBOTO);
					done();
				});
			});
		});

		it('should be composant is deprecated', () => {
			const component = 'datepicker';
			const target = 'datepicker';

			service.setTheme(THEMES.MATERIAL);
			service.deprecated(component, target);
			expect(service.isMaterial()).toBeTruthy();
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
	});

	describe('With bad css name', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{provide: DOCUMENT, useValue: {styleSheets: [{href: 'styles.css', rules: [{selectorText: '.ob-bootstrap-telemetry'}]}]}}
				]
			});

			service = TestBed.inject(ObThemeService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should provide "Unknown" as current theme', () => {
			expect(service.theme).toBe('Unknown');
		});
	});
});
