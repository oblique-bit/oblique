import {TestBed} from '@angular/core/testing';
import {THEMES, ThemeService} from './theme.service';

describe('ThemeService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		expect(service).toBeTruthy();
	});

	it('should be the Default Theme  equal to  MATERIAL', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		service.setDefaultTheme();
		expect(service.isMaterial()).toBeTruthy();
	});

	it('should be Theme equal to  MATERIAL', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		service.setTheme(THEMES.MATERIAL);
		expect(service.isMaterial()).toBeTruthy();
	});

	it('should be Theme not equal to  BOOTSTRAP', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		service.setTheme(THEMES.BOOTSTRAP);
		expect(service.isMaterial()).not.toBeTruthy();
	});

	it('should be composant is deprecated', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		const component = 'datepicker';
		const target =  'datepicker';

		service.setTheme(THEMES.MATERIAL);
		service.deprecated(component, target);
		expect(service.isMaterial()).toBeTruthy();
	});

	it('should enable Frutiger', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		const spy = jest.spyOn(service, 'setFrutiger');
		const enable = true;
		service.setFrutiger(enable);
		expect(spy).toHaveBeenCalled();
		expect(service.setFrutiger).toBeTruthy();
		spy.mockRestore();
	});

	it('should not enable Frutiger', () => {
		const service: ThemeService = TestBed.get(ThemeService);
		const spy = jest.spyOn(service, 'setFrutiger');
		const enable = false;
		service.setFrutiger(enable);
		expect(spy).toHaveBeenCalled();
		expect(service.setFrutiger).toBeTruthy();
		spy.mockRestore();
	});




});
