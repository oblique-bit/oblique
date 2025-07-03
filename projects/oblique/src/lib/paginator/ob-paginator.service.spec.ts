import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService, provideTranslateService} from '@ngx-translate/core';
import {ObPaginatorService} from './ob-paginator.service';
import {provideObliqueConfiguration} from '../utilities';
import {provideHttpClient} from '@angular/common/http';
import obliqueEn from '../../assets/i18n/oblique-en.json';
import obliqueIt from '../../assets/i18n/oblique-it.json';
import obliqueDe from '../../assets/i18n/oblique-de.json';
import obliqueFr from '../../assets/i18n/oblique-fr.json';

describe('ObPaginatorService', () => {
	let paginatorService: ObPaginatorService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule],
			providers: [
				ObPaginatorService,
				provideHttpClient(),
				provideTranslateService(),
				provideObliqueConfiguration({
					accessibilityStatement: {
						applicationName: 'appName',
						createdOn: new Date('2025-01-31'),
						conformity: 'none',
						applicationOperator: 'Operator',
						contact: {emails: ['e@mail.com']}
					}
				})
			]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		paginatorService = TestBed.inject(ObPaginatorService);
		translateService.setTranslation('en', obliqueEn, true);
		translateService.setTranslation('it', obliqueIt, true);
		translateService.setTranslation('de', obliqueDe, true);
		translateService.setTranslation('fr', obliqueFr, true);
		jest.spyOn(translateService, 'use');
		jest.spyOn(paginatorService.changes, 'next');
	});

	it('should be created', () => {
		expect(paginatorService).toBeTruthy();
	});

	it('should not have called translateService.use() yet', () => {
		expect(translateService.use).not.toHaveBeenCalled();
	});

	describe.each([
		{
			language: 'en',
			labels: [
				{name: 'page 2, pageSize 5, length 25', page: 1, pageSize: 5, length: 25, expectedTranslation: `Page 2 of 5`},
				{name: 'pageSize equal as length and page 0', page: 0, pageSize: 10, length: 10, expectedTranslation: `Page 1 of 1`},
				{name: 'length 0', page: 0, pageSize: 2, length: 0, expectedTranslation: `Page 0 of 0`},
				{name: 'pageSize 0', page: 0, pageSize: 0, length: 2, expectedTranslation: `Page 0 of 2`},
				{name: 'length lower than page * pageSize', page: 2, pageSize: 3, length: 1, expectedTranslation: `Page 3 of 1`}
			]
		},
		{
			language: 'it',
			labels: [
				{name: 'page 2, pageSize 5, length 25', page: 1, pageSize: 5, length: 25, expectedTranslation: `Pagina 2 di 5`},
				{name: 'pageSize equal as length and page 0', page: 0, pageSize: 10, length: 10, expectedTranslation: `Pagina 1 di 1`},
				{name: 'length 0', page: 0, pageSize: 2, length: 0, expectedTranslation: `Pagina 0 di 0`},
				{name: 'pageSize 0', page: 0, pageSize: 0, length: 2, expectedTranslation: `Pagina 0 di 2`},
				{name: 'length lower than page * pageSize', page: 2, pageSize: 3, length: 1, expectedTranslation: `Pagina 3 di 1`}
			]
		},
		{
			language: 'de',
			labels: [
				{name: 'page 2, pageSize 5, length 25', page: 1, pageSize: 5, length: 25, expectedTranslation: `Seite 2 von 5`},
				{name: 'pageSize equal as length and page 0', page: 0, pageSize: 10, length: 10, expectedTranslation: `Seite 1 von 1`},
				{name: 'length 0', page: 0, pageSize: 2, length: 0, expectedTranslation: `Seite 0 von 0`},
				{name: 'pageSize 0', page: 0, pageSize: 0, length: 2, expectedTranslation: `Seite 0 von 2`},
				{name: 'length lower than page * pageSize', page: 2, pageSize: 3, length: 1, expectedTranslation: `Seite 3 von 1`}
			]
		},
		{
			language: 'fr',
			labels: [
				{name: 'page 2, pageSize 5, length 25', page: 1, pageSize: 5, length: 25, expectedTranslation: `Page 2 sur 5`},
				{name: 'pageSize equal as length and page 0', page: 0, pageSize: 10, length: 10, expectedTranslation: `Page 1 sur 1`},
				{name: 'length 0', page: 0, pageSize: 2, length: 0, expectedTranslation: `Page 0 sur 0`},
				{name: 'pageSize 0', page: 0, pageSize: 0, length: 2, expectedTranslation: `Page 0 sur 2`},
				{name: 'length lower than page * pageSize', page: 2, pageSize: 3, length: 1, expectedTranslation: `Page 3 sur 1`}
			]
		}
	])(`should get $expected if $name`, ({language, labels}) => {
		beforeEach(() => {
			translateService.use(language);
		});

		it('should have called translateService.use() once with the langugage param', () => {
			expect(translateService.use).toHaveBeenNthCalledWith(1, language);
		});

		it('should have called translateService.use() once with the langugage param', () => {
			expect(translateService.use).toHaveBeenNthCalledWith(1, language);
		});

		it.each(labels)(`should translate $name to $language`, item => {
			const rangeLabel = paginatorService.getRangeLabel(item.page, item.pageSize, item.length);
			expect(rangeLabel).toBe(item.expectedTranslation);
		});
	});

	describe.each([
		{
			language: 'en',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Items per page'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Jump to last page'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Jump to first page'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Go to the next page'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Go to the previous page'},
				{labelName: 'pageLabel', expectedTranslation: 'Page'},
				{labelName: 'ofLabel', expectedTranslation: 'of'}
			]
		},
		{
			language: 'it',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Articoli per pagina'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Salta all’ultima pagina'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Andare alla pagina successiva'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Andare alla pagina precedente'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Salta alla prima pagina'},
				{labelName: 'pageLabel', expectedTranslation: 'Pagina'},
				{labelName: 'ofLabel', expectedTranslation: 'di'}
			]
		},
		{
			language: 'de',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Elemente pro Seite'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Auf die letzte Seite springen'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Auf die nächste Seite gehen'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Auf die vorige Seite gehen'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Auf die erste Seite springen'},
				{labelName: 'pageLabel', expectedTranslation: 'Seite'},
				{labelName: 'ofLabel', expectedTranslation: 'von'}
			]
		},
		{
			language: 'fr',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Éléments par page'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Sauter à la dernière page'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Aller à la page suivante'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Aller à la page précédente'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Sauter à la première page'},
				{labelName: 'pageLabel', expectedTranslation: 'Page'},
				{labelName: 'ofLabel', expectedTranslation: 'sur'}
			]
		}
	])(`labels for $language language`, ({language, labels}) => {
		beforeEach(() => {
			translateService.use(language);
		});

		it('should have called translateService.use() once with the language param', () => {
			expect(translateService.use).toHaveBeenNthCalledWith(1, language);
		});

		it('should have called changes once', () => {
			expect(paginatorService.changes.next).toHaveBeenCalledTimes(1);
		});

		it.each(labels)(`should translate $labelName`, item => {
			const translated = paginatorService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
