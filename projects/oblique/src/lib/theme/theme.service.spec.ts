import {TestBed} from '@angular/core/testing';
import {FONTS, THEMES, ObThemeService} from './theme.service';

describe('ThemeService', () => {
	let service: ObThemeService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ObThemeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
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
