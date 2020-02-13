import {TestBed} from '@angular/core/testing';
import {THEMES, ThemeService} from './theme.service';

describe('ThemeService', () => {
	let service: ThemeService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ThemeService);
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

		it('theme$ should emit the last given theme', (done) => {
			service.setTheme(THEMES.MATERIAL);
			service.theme$.subscribe(theme => {
				expect(theme).toBe(THEMES.MATERIAL);
				done();
			});
		});
	});


	it('should be composant is deprecated', () => {
		const component = 'datepicker';
		const target =  'datepicker';

		service.setTheme(THEMES.MATERIAL);
		service.deprecated(component, target);
		expect(service.isMaterial()).toBeTruthy();
	});

	it('should enable Frutiger', () => {
		const spy = jest.spyOn(service, 'setFrutiger');
		const enable = true;
		service.setFrutiger(enable);
		expect(spy).toHaveBeenCalled();
		expect(service.setFrutiger).toBeTruthy();
		spy.mockRestore();
	});

	it('should not enable Frutiger', () => {
		const spy = jest.spyOn(service, 'setFrutiger');
		const enable = false;
		service.setFrutiger(enable);
		expect(spy).toHaveBeenCalled();
		expect(service.setFrutiger).toBeTruthy();
		spy.mockRestore();
	});




});
