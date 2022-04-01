import {HttpClientModule} from '@angular/common/http';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatIconRegistry} from '@angular/material/icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ObIconModule, ObIconService} from './icon.module';

describe('IconService', () => {
	let registry: MatIconRegistry;
	let iconService: ObIconService;
	const icons = {
		test1: {
			literal:
				'<svg id="test_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app" viewBox="0 0 16 16"><path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/></svg>',
			core: '<path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/>'
		},
		test2: {
			literal:
				'<svg id="test_2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/></svg>',
			core: '<path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>'
		},
		overwrite1: {
			literal:
				'<svg id="test_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/></svg>',
			core: '<path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>'
		}
	};
	const iconSet1 = `<svg><defs>${icons.test1.literal}</defs></svg>`;
	const iconSet2 = `<svg><defs>${icons.test2.literal.replace('test_2', 'test_1')}</defs></svg>`;

	const serializer = new XMLSerializer();
	describe('without config', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObIconModule, HttpClientModule, MatIconTestingModule],
				providers: [
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry}
				]
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		}));

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
				iconService.registerIcons({name: 'test_1', svg: icons.test1.literal}, {name: 'test_1', svg: icons.test2.literal});
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
	});

	describe('with default config without Oblique', () => {
		beforeEach(waitForAsync(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [ObIconModule.forRoot({registerObliqueIcons: false}), HttpClientTestingModule, MatIconTestingModule],
				providers: [
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry}
				]
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		}));

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		it('should have the default font class', () => {
			expect(registry.getDefaultFontSetClass()).toBe('material-icons');
		});
	});

	describe('with default config without Oblique and with a font class', () => {
		beforeEach(waitForAsync(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [ObIconModule.forRoot({registerObliqueIcons: false, fontClass: 'fa'}), HttpClientTestingModule, MatIconTestingModule],
				providers: [
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry}
				]
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		}));

		it('should be created', () => {
			expect(iconService).toBeTruthy();
		});

		it('should have a custom font class', () => {
			expect(registry.getDefaultFontSetClass()).toBe('fa');
		});
	});

	describe('with default config without Oblique and with additional icon set', () => {
		beforeEach(waitForAsync(() => {
			jest.resetModules();
			TestBed.configureTestingModule({
				imports: [
					ObIconModule.forRoot({registerObliqueIcons: false, additionalIcons: [iconSet1]}),
					HttpClientTestingModule,
					MatIconTestingModule
				],
				providers: [
					{provide: ObIconService, useClass: ObIconService},
					{provide: MatIconRegistry, useClass: MatIconRegistry}
				]
			});
			registry = TestBed.inject(MatIconRegistry);
			iconService = TestBed.inject(ObIconService);
		}));

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
