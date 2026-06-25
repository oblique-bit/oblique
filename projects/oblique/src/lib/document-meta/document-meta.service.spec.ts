import {DOCUMENT} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subject, of} from 'rxjs';
import {ObDocumentMetaService} from './document-meta.service';

describe(ObDocumentMetaService.name, () => {
	let service: ObDocumentMetaService;
	let routerEvents: Subject<NavigationEnd>;
	let routeData: Subject<{title?: string; description?: string}>;
	let title: {setTitle: jest.Mock};
	let translate: {
		get: jest.Mock;
		instant: jest.Mock;
		onLangChange: Subject<void>;
	};

	beforeEach(() => {
		document.head.querySelector('meta[name=description]')?.remove();
		routerEvents = new Subject<NavigationEnd>();
		routeData = new Subject<{title?: string; description?: string}>();
		title = {setTitle: jest.fn()};
		translate = {
			get: jest.fn((key: string | string[]) => {
				if (Array.isArray(key)) {
					return of(
						key.reduce<Record<string, string>>((translations, translationKey) => {
							translations[translationKey] = translationKey ? `${translationKey}-translated` : '';
							return translations;
						}, {})
					);
				}
				return of(`${key}-translated`);
			}),
			instant: jest.fn(key => `${key}-instant`),
			onLangChange: new Subject<void>(),
		};

		TestBed.configureTestingModule({
			providers: [
				ObDocumentMetaService,
				{provide: ActivatedRoute, useValue: {outlet: 'primary', data: routeData}},
				{provide: Router, useValue: {events: routerEvents}},
				{provide: Title, useValue: title},
				{provide: TranslateService, useValue: translate},
				{provide: DOCUMENT, useValue: document},
			],
		});
		service = TestBed.inject(ObDocumentMetaService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create the description meta element', () => {
		expect(document.head.querySelector('meta[name=description]')).toBeTruthy();
	});

	it('should reuse an existing description meta element', () => {
		TestBed.resetTestingModule();
		document.head.querySelector('meta[name=description]')?.remove();
		const meta = document.createElement('meta');
		meta.setAttribute('name', 'description');
		document.head.appendChild(meta);
		jest.spyOn(document.head, 'appendChild');

		TestBed.configureTestingModule({
			providers: [
				ObDocumentMetaService,
				{provide: ActivatedRoute, useValue: {outlet: 'primary', data: routeData}},
				{provide: Router, useValue: {events: routerEvents}},
				{provide: Title, useValue: title},
				{provide: TranslateService, useValue: translate},
				{provide: DOCUMENT, useValue: document},
			],
		});

		TestBed.inject(ObDocumentMetaService);

		expect(document.head.appendChild).not.toHaveBeenCalled();
	});

	describe(ObDocumentMetaService.prototype.setTitle.name, () => {
		it('should set a translated title with translated suffix when suffix translation is present', () => {
			service.setTitle('title', ' | ', 'suffix');

			expect(title.setTitle).toHaveBeenCalledWith('title-translated | suffix-translated');
		});

		it('should set a translated title without separator or suffix when suffix translation is empty', () => {
			translate.get.mockReturnValue(of({title: 'Title', suffix: ''}));

			service.setTitle('title', ' | ', 'suffix');

			expect(title.setTitle).toHaveBeenCalledWith('Title');
		});

		it('should set a suffix as title when title is empty', () => {
			service.setTitle('', ' | ', 'suffix');

			expect(title.setTitle).toHaveBeenCalledWith('suffix-instant');
		});

		it('should not set a title when title and suffix are empty', () => {
			service.setTitle('');

			expect(title.setTitle).not.toHaveBeenCalled();
		});
	});

	describe(ObDocumentMetaService.prototype.setDescription.name, () => {
		it('should set meta description content to the translated description', () => {
			service.setDescription('description');

			expect(service.getMetaDescription()).toBe('description-translated');
		});

		it('should clear meta description content when description is empty', () => {
			service.setDescription('');

			expect(service.getMetaDescription()).toBe('');
		});
	});

	describe('navigation events', () => {
		it('should update title and description from route data', () => {
			routerEvents.next(new NavigationEnd(1, '/route', '/route'));
			routeData.next({title: 'route-title', description: 'route-description'});

			expect(title.setTitle).toHaveBeenCalledWith('route-title-translated');
			expect(service.getMetaDescription()).toBe('route-description-translated');
		});

		it('should use the default description when route data has no description', () => {
			service.description = 'default-description';

			routerEvents.next(new NavigationEnd(1, '/route', '/route'));
			routeData.next({title: 'route-title'});

			expect(service.getMetaDescription()).toBe('default-description-translated');
		});

		it('should update current meta information on language change', () => {
			routerEvents.next(new NavigationEnd(1, '/route', '/route'));
			routeData.next({title: 'route-title', description: 'route-description'});
			title.setTitle.mockClear();

			translate.onLangChange.next();

			expect(title.setTitle).toHaveBeenCalledWith('route-title-translated');
			expect(service.getMetaDescription()).toBe('route-description-translated');
		});
	});

	it('should stop updating metadata after destroy', () => {
		service.ngOnDestroy();

		routerEvents.next(new NavigationEnd(1, '/route', '/route'));
		routeData.next({title: 'route-title', description: 'route-description'});
		translate.onLangChange.next();

		expect(title.setTitle).not.toHaveBeenCalled();
	});
});
