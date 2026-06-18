import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatIconRegistry} from '@angular/material/icon';
import {ObIconService} from './icon.service';
import {provideObliqueTestingConfiguration} from '../utilities';

interface ObIconServicePrivate {
	getIconSets: () => string[];
}

describe('IconService', () => {
	let registry: MatIconRegistry;
	let iconService: ObIconService;
	const icons = {
		test1: {
			literal:
				'<svg id="test_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app" viewBox="0 0 16 16"><path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/></svg>',
			core: '<path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/>',
		},
		test2: {
			literal:
				'<svg id="test_2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/></svg>',
			core: '<path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>',
		},
		overwrite1: {
			literal:
				'<svg id="test_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/></svg>',
			core: '<path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>',
		},
	};
	const iconSet1 = `<svg><defs>${icons.test1.literal}</defs></svg>`;
	const iconSet2 = `<svg><defs>${icons.test2.literal.replace('test_2', 'test_1')}</defs></svg>`;

	const serializer = new XMLSerializer();
	describe('without config', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [HttpClientModule, MatIconTestingModule],
				providers: [
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry},
				],
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		});

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		describe('registerIcons', () => {
			it('should register icons', done => {
				iconService.registerIcons({name: 'test_1', svg: icons.test1.literal});
				registry.getNamedSvgIcon('test_1').subscribe(svg => {
					expect(serializer.serializeToString(svg)).toContain(icons.test1.core);
					done();
				});
			});
			it('should overwrite icons with same name', done => {
				iconService.registerIcons(
					{name: 'test_1', svg: icons.test1.literal},
					{name: 'test_1', svg: icons.test2.literal}
				);
				registry.getNamedSvgIcon('test_1').subscribe(svg => {
					expect(serializer.serializeToString(svg)).toContain(icons.test2.core);
					done();
				});
			});
		});

		describe('registerIconSets', () => {
			it('should register icon sets', done => {
				iconService.registerIconSets(iconSet1);
				registry.getNamedSvgIcon('test_1').subscribe(svg => {
					expect(serializer.serializeToString(svg)).toContain(icons.test1.core);
					done();
				});
			});
			it('should overwrite icons with same name', done => {
				iconService.registerIconSets(iconSet1, iconSet2);
				registry.getNamedSvgIcon('test_1').subscribe(svg => {
					expect(serializer.serializeToString(svg)).toContain(icons.test2.core);
					done();
				});
			});
		});

		describe('registerIconSetsAsync', () => {
			it('should register icon sets', () => {
				// TODO, the http request should be mocked to properly test this case
				jest.spyOn(registry, 'addSvgIconSet');
				iconService.registerIconSetsAsync('url');
				expect(registry.addSvgIconSet).toHaveBeenCalled();
			});
		});

		describe('registerIconsAsync', () => {
			it('should register icon sets', () => {
				// TODO, the http request should be mocked to properly test this case
				jest.spyOn(registry, 'addSvgIcon');
				iconService.registerIconsAsync({name: 'test', url: 'url'});
				expect(registry.addSvgIcon).toHaveBeenCalled();
			});
		});

		describe('registerOnAppInit', () => {
			it('should register the Oblique icon set with the default config', () => {
				jest.spyOn(registry, 'addSvgIconSetLiteral');

				iconService.registerOnAppInit();

				expect(registry.addSvgIconSetLiteral).toHaveBeenCalled();
			});

			it('should register Oblique and additional icon sets', () => {
				jest.spyOn(registry, 'addSvgIconSetLiteral');

				iconService.registerOnAppInit({registerObliqueIcons: true, additionalIcons: [iconSet1]});

				expect(registry.addSvgIconSetLiteral).toHaveBeenCalledTimes(2);
			});

			it('should skip icon set registration when Oblique and additional icons are disabled', () => {
				jest.spyOn(registry, 'addSvgIconSetLiteral');

				iconService.registerOnAppInit({registerObliqueIcons: false});

				expect(registry.addSvgIconSetLiteral).not.toHaveBeenCalled();
			});

			it('should register a custom font class', () => {
				jest.spyOn(registry, 'setDefaultFontSetClass');

				iconService.registerOnAppInit({registerObliqueIcons: false, fontClass: 'custom-icons'});

				expect(registry.setDefaultFontSetClass).toHaveBeenCalledWith('custom-icons');
			});

			it('should skip font class registration without an app init config', () => {
				const iconServicePrivate = iconService as unknown as ObIconServicePrivate;
				const getIconSets = iconServicePrivate.getIconSets;
				Object.defineProperty(iconService, 'getIconSets', {configurable: true, value: () => []});
				jest.spyOn(registry, 'setDefaultFontSetClass');

				Reflect.apply(iconService.registerOnAppInit, iconService, [null]);

				expect(registry.setDefaultFontSetClass).not.toHaveBeenCalled();
				Object.defineProperty(iconService, 'getIconSets', {configurable: true, value: getIconSets});
			});

			it('should reject a null app init config', () => {
				expect(() => Reflect.apply(iconService.registerOnAppInit, iconService, [null])).toThrow();
			});
		});
	});

	describe('with default config without Oblique', () => {
		beforeEach(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [MatIconTestingModule],
				providers: [
					provideObliqueTestingConfiguration({
						icon: {registerObliqueIcons: false},
					}),
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry},
				],
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		});

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		it('should have the default font class', () => {
			expect(registry.getDefaultFontSetClass().includes('material-icons')).toBe(true);
		});
	});

	describe('with default config without Oblique and with a font class', () => {
		beforeEach(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [MatIconTestingModule],
				providers: [
					provideObliqueTestingConfiguration({
						icon: {registerObliqueIcons: false, fontClass: 'fa'},
					}),
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry},
				],
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		});

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		it('should have a custom font class', () => {
			expect(registry.getDefaultFontSetClass().includes('fa')).toBe(true);
		});
	});

	describe('with default config without Oblique and with additional icon set', () => {
		beforeEach(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [MatIconTestingModule],
				providers: [
					provideObliqueTestingConfiguration({
						icon: {registerObliqueIcons: false, additionalIcons: [iconSet1]},
					}),
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry},
				],
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		});

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		it('should register additional icons', done => {
			registry.getNamedSvgIcon('test_1').subscribe(svg => {
				expect(serializer.serializeToString(svg)).toContain(icons.test1.core);
				done();
			});
		});
	});
});
