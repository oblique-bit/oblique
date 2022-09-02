import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ObPaginatorService} from './ob-paginator.service';
import {ObPaginatorModule} from './ob-paginator.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ObPaginatorService', () => {
	let paginatorService: ObPaginatorService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(), ObPaginatorModule, NoopAnimationsModule, HttpClientTestingModule]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		paginatorService = TestBed.inject(ObPaginatorService);
		translateService.setTranslation('en', {
			'i18n.pagination.items-per-page': 'Items per page',
			'i18n.pagination.next-page': 'Go to the next page',
			'i18n.pagination.previous-page': 'Go to the previous page',
			'i18n.pagination.of-label': 'of',
			'i18n.pagination.first-page': 'Jump to first page',
			'i18n.pagination.last-page': 'Jump to last page'
		});
		translateService.setTranslation('de', {
			'i18n.pagination.items-per-page': 'Elemente pro Seite',
			'i18n.pagination.next-page': 'Auf die nächste Seite gehen',
			'i18n.pagination.previous-page': 'Auf die vorige Seite gehen',
			'i18n.pagination.of-label': 'von',
			'i18n.pagination.first-page': 'Auf die erste Seite springen',
			'i18n.pagination.last-page': 'Auf die letzte Seite springen'
		});
		translateService.setTranslation('fr', {
			'i18n.pagination.items-per-page': 'Éléments par page',
			'i18n.pagination.next-page': 'Aller à la page suivante',
			'i18n.pagination.previous-page': 'Aller à la page précédente',
			'i18n.pagination.of-label': 'de',
			'i18n.pagination.first-page': 'Sauter à la première page',
			'i18n.pagination.last-page': 'Sauter à la dernière page'
		});
		translateService.setTranslation('it', {
			'i18n.pagination.items-per-page': 'Articoli per pagina',
			'i18n.pagination.next-page': 'Andare alla pagina successiva',
			'i18n.pagination.previous-page': 'Andare alla pagina precedente',
			'i18n.pagination.of-label': 'di',
			'i18n.pagination.first-page': 'Salta alla prima pagina',
			'i18n.pagination.last-page': "Salta all'ultima pagina"
		});
		translateService.use('en');
	});

	it('should be created', () => {
		expect(paginatorService).toBeTruthy();
	});

	describe('getRangeLabel', () => {
		it.each([
			{name: 'page 2, pageSize 5, length 25', page: 2, pageSize: 5, length: 25, expected: `11 - 15 of 25`},
			{name: 'pageSize equal as length and page 0', page: 0, pageSize: 10, length: 10, expected: `1 - 10 of 10`},
			{name: 'length 0', page: 0, pageSize: 2, length: 0, expected: `0 of 0`},
			{name: 'pageSize 0', page: 0, pageSize: 0, length: 2, expected: `0 of 2`},
			{name: 'length lower than page * pageSize', page: 2, pageSize: 3, length: 1, expected: `7 - 1 of 1`}
		])(`should get $expected if $name`, ({page, pageSize, length, expected}) => {
			const rangeLabel = paginatorService.getRangeLabel(page, pageSize, length);
			expect(rangeLabel).toBe(expected);
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
				{labelName: 'previousPageLabel', expectedTranslation: 'Go to the previous page'}
			]
		},
		{
			language: 'it',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Articoli per pagina'},
				{labelName: 'lastPageLabel', expectedTranslation: "Salta all'ultima pagina"},
				{labelName: 'nextPageLabel', expectedTranslation: 'Andare alla pagina successiva'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Andare alla pagina precedente'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Salta alla prima pagina'}
			]
		},
		{
			language: 'de',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Elemente pro Seite'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Auf die letzte Seite springen'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Auf die nächste Seite gehen'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Auf die vorige Seite gehen'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Auf die erste Seite springen'}
			]
		},
		{
			language: 'fr',
			labels: [
				{labelName: 'itemsPerPageLabel', expectedTranslation: 'Éléments par page'},
				{labelName: 'lastPageLabel', expectedTranslation: 'Sauter à la dernière page'},
				{labelName: 'nextPageLabel', expectedTranslation: 'Aller à la page suivante'},
				{labelName: 'previousPageLabel', expectedTranslation: 'Aller à la page précédente'},
				{labelName: 'firstPageLabel', expectedTranslation: 'Sauter à la première page'}
			]
		}
	])(`labels for $language language`, ({language, labels}) => {
		beforeEach(() => {
			translateService.use(language);
		});

		it.each(labels)(`should translate $labelName`, item => {
			const translated = paginatorService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
