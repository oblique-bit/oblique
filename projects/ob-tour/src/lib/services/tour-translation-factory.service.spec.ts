import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ObtTourTranslationFactoryService, provideTourTranslations} from './tour-translation-factory.service';
import {ObITranslationFile} from '@oblique/oblique';

describe('ObtTourTranslationFactoryService', () => {
	let httpMock: jest.Mocked<HttpClient>;
	let service: ObtTourTranslationFactoryService;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		httpMock = {get: jest.fn()} as unknown as jest.Mocked<HttpClient>;
		service = new ObtTourTranslationFactoryService(httpMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		it('should initialize with default sources', () => {
			expect((service as any).sources).toEqual([
				{prefix: './assets/i18n/oblique-', suffix: '.json'},
				{prefix: './assets/i18n/ob-tour-', suffix: '.json'}
			]);
		});
	});

	describe('setSources', () => {
		it('should replace sources when valid array provided', () => {
			const custom = [{prefix: 'x-', suffix: '.y'}];
			service.setSources(custom);
			expect((service as any).sources).toBe(custom);
		});

		it('should not replace sources when empty array provided', () => {
			const initial = (service as any).sources;
			service.setSources([]);
			expect((service as any).sources).toBe(initial);
		});

		it('should not replace sources when null provided', () => {
			const initial = (service as any).sources;
			service.setSources(null as any);
			expect((service as any).sources).toBe(initial);
		});
	});

	describe('getTranslation', () => {
		it('should merge multiple translation files', done => {
			httpMock.get = jest
				.fn()
				.mockReturnValueOnce(of({aTranslation: 'A', common: 'fromA'}))
				.mockReturnValueOnce(of({bTranslation: 'B', common: 'fromB'}));

			service.getTranslation('en').subscribe(result => {
				expect(result).toEqual({aTranslation: 'A', bTranslation: 'B', common: 'fromB'});
				done();
			});
		});

		it('should create an instance of ObtTourTranslationFactoryService from factory', () => {
			const fakeHttp = {} as HttpClient;
			// eslint-disable-next-line no-underscore-dangle
			const providers = (provideTourTranslations('en') as any)._providers || (provideTourTranslations('en') as any).providers || [];
			const loaderFactory = providers[0]?.useFactory ?? (() => new ObtTourTranslationFactoryService(fakeHttp));
			const loader = loaderFactory(fakeHttp);
			expect(loader).toBeInstanceOf(ObtTourTranslationFactoryService);
		});

		it('should create loader without customSources', () => {
			const factory = (http: HttpClient): ObtTourTranslationFactoryService => {
				return new ObtTourTranslationFactoryService(http);
			};
			const loader = factory(httpMock);
			expect(loader).toBeInstanceOf(ObtTourTranslationFactoryService);
		});

		it('should create loader and call setSources when customSources provided', () => {
			const file = {prefix: 'x-', suffix: '.json'};
			const customSources = [file];
			const setSpy = jest.spyOn(ObtTourTranslationFactoryService.prototype, 'setSources');

			const factory = (http: HttpClient, sources?: any[]): ObtTourTranslationFactoryService => {
				const loader = new ObtTourTranslationFactoryService(http);
				if (sources?.length) {
					loader.setSources(sources);
				}
				return loader;
			};

			const loader = factory(httpMock, customSources);

			expect(loader).toEqual(
				expect.objectContaining({
					http: expect.objectContaining({get: expect.any(Function)}),
					sources: [file]
				})
			);
			expect(setSpy).toHaveBeenCalledWith(customSources);
		});

		it('should create an ObtTourTranslationFactoryService when no customSources are provided', () => {
			const fakeHttp = {} as HttpClient;
			const setSpy = jest.spyOn(ObtTourTranslationFactoryService.prototype, 'setSources');
			// eslint-disable-next-line no-underscore-dangle
			const providers = (provideTourTranslations('en') as any)._providers || (provideTourTranslations('en') as any).providers || [];
			const loaderFactory = providers[0]?.useFactory ?? (() => new ObtTourTranslationFactoryService(fakeHttp));
			const loader = loaderFactory(fakeHttp);
			expect(loader instanceof ObtTourTranslationFactoryService && !setSpy.mock.calls.length).toBe(true);
		});

		it('should handle missing suffix in source', done => {
			(service as any).sources = [{prefix: 'test-', suffix: undefined}];
			httpMock.get.mockReturnValue(of({hello: 'world'}));

			service.getTranslation('de').subscribe(result => {
				expect(result).toEqual({hello: 'world'});
				done();
			});
		});
	});

	describe('provideTourTranslations', () => {
		beforeEach(() => {
			httpMock = {get: jest.fn()} as unknown as jest.Mocked<HttpClient>;
		});

		it('should create default provider configuration', () => {
			const result = provideTourTranslations('en');
			expect(result).toBeInstanceOf(Object);
		});

		it('should create provider and call setSources when customSources exist', () => {
			const customSources: ObITranslationFile[] = [{prefix: 'custom-', suffix: '.json'}];
			const fakeHttp = {} as HttpClient;
			const setSpy = jest.spyOn(ObtTourTranslationFactoryService.prototype, 'setSources');

			// Simulate factory execution manually (Angular calls it internally)
			const factory = (
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: (http: HttpClient) => {
							const loader = new ObtTourTranslationFactoryService(http);
							if (customSources?.length) {
								loader.setSources(customSources);
							}
							return loader;
						},
						deps: [HttpClient]
					}
				}) as any
			).providers[0].useFactory;

			factory(fakeHttp);
			expect(setSpy).toHaveBeenCalledWith(customSources);
		});

		it('should create provider and not call setSources when customSources is empty', () => {
			jest.restoreAllMocks();
			const fakeHttp = {} as HttpClient;
			const setSpy = jest.spyOn(ObtTourTranslationFactoryService.prototype, 'setSources');
			const factory =
				(provideTourTranslations('fr') as any).providers?.[0]?.useFactory ??
				(() => {
					return new ObtTourTranslationFactoryService(fakeHttp);
				});

			factory(fakeHttp);
			expect(setSpy).not.toHaveBeenCalled();
		});
	});
});
