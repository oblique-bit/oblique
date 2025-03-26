import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService, provideTranslateService} from '@ngx-translate/core';
import {ObDatepickerIntlService} from './ob-datepicker.service';

describe('ObDatepickerIntlService', () => {
	let datepickerService: ObDatepickerIntlService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule],
			providers: [ObDatepickerIntlService, provideTranslateService()]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		datepickerService = TestBed.inject(ObDatepickerIntlService);
		translateService.setTranslation('en', {
			'i18n.datepicker.calender.label': 'Calendar',
			'i18n.datepicker.open-calender.label': 'Open calendar',
			'i18n.datepicker.close-calender.label': 'Close calendar',
			'i18n.datepicker.prev-month.label': 'Previous month',
			'i18n.datepicker.next-month.label': 'Next month',
			'i18n.datepicker.prev-year.label': 'Previous year',
			'i18n.datepicker.next-year.label': 'Next year',
			'i18n.datepicker.prev-multi-year.label': 'Previous 24 years',
			'i18n.datepicker.next-multi-year.label': 'Next 24 years',
			'i18n.datepicker.switch-to-month-view.label': 'Choose date',
			'i18n.datepicker.switch-to-multi-year-view.label': 'Choose month and year',
			'i18n.datepicker.comparison-date.label': 'Comparison range'
		});
		translateService.setTranslation('de', {
			'i18n.datepicker.calender.label': 'Kalender',
			'i18n.datepicker.open-calender.label': 'Kalender öffnen',
			'i18n.datepicker.close-calender.label': 'Kalender schliessen',
			'i18n.datepicker.prev-month.label': 'Vorheriger Monat',
			'i18n.datepicker.next-month.label': 'Nächster Monat',
			'i18n.datepicker.prev-year.label': 'Vorheriges Jahr',
			'i18n.datepicker.next-year.label': 'Nächstes Jahr',
			'i18n.datepicker.prev-multi-year.label': 'Vorherige 24 Jahre',
			'i18n.datepicker.next-multi-year.label': 'Nächste 24 Jahre',
			'i18n.datepicker.switch-to-month-view.label': 'Wähle ein Datum',
			'i18n.datepicker.switch-to-multi-year-view.label': 'Wähle ein Monat und Jahr',
			'i18n.datepicker.comparison-date.label': 'Vergleichsspanne'
		});
		translateService.setTranslation('fr', {
			'i18n.datepicker.calender.label': 'Calendrier',
			'i18n.datepicker.open-calender.label': 'Ouvrir le calendrier',
			'i18n.datepicker.close-calender.label': 'Fermer le calendrier',
			'i18n.datepicker.prev-month.label': 'Mois précédent',
			'i18n.datepicker.next-month.label': 'Mois prochain',
			'i18n.datepicker.prev-year.label': 'Année précédente',
			'i18n.datepicker.next-year.label': 'Année prochaine',
			'i18n.datepicker.prev-multi-year.label': '24 années précédentes',
			'i18n.datepicker.next-multi-year.label': 'Prochaines 24 années',
			'i18n.datepicker.switch-to-month-view.label': 'Choisir la date',
			'i18n.datepicker.switch-to-multi-year-view.label': "Choisir le mois et l'année",
			'i18n.datepicker.comparison-date.label': 'Plage de comparaison'
		});
		translateService.setTranslation('it', {
			'i18n.datepicker.calender.label': 'Calendario',
			'i18n.datepicker.open-calender.label': 'Aprire il calendario',
			'i18n.datepicker.close-calender.label': 'Chiudere il calendario',
			'i18n.datepicker.prev-month.label': 'Mese precedente',
			'i18n.datepicker.next-month.label': 'Mese successivo',
			'i18n.datepicker.prev-year.label': 'Anno precedente',
			'i18n.datepicker.next-year.label': 'Anno successivo',
			'i18n.datepicker.prev-multi-year.label': '24 anni precedenti',
			'i18n.datepicker.next-multi-year.label': '24 anni successivi',
			'i18n.datepicker.switch-to-month-view.label': 'Scegliere la data',
			'i18n.datepicker.switch-to-multi-year-view.label': "Scegliere il mese e l'anno'",
			'i18n.datepicker.comparison-date.label': 'Intervallo di confronto'
		});
		translateService.use('en');
	});

	it('should be created', () => {
		expect(datepickerService).toBeTruthy();
	});

	describe.each([
		{
			language: 'en',
			labels: [
				{labelName: 'calendarLabel', expectedTranslation: 'Calendar'},
				{labelName: 'openCalendarLabel', expectedTranslation: 'Open calendar'},
				{labelName: 'closeCalendarLabel', expectedTranslation: 'Close calendar'},
				{labelName: 'prevMonthLabel', expectedTranslation: 'Previous month'},
				{labelName: 'nextMonthLabel', expectedTranslation: 'Next month'},
				{labelName: 'prevYearLabel', expectedTranslation: 'Previous year'},
				{labelName: 'nextYearLabel', expectedTranslation: 'Next year'},
				{labelName: 'prevMultiYearLabel', expectedTranslation: 'Previous 24 years'},
				{labelName: 'nextMultiYearLabel', expectedTranslation: 'Next 24 years'},
				{labelName: 'switchToMonthViewLabel', expectedTranslation: 'Choose date'},
				{labelName: 'switchToMultiYearViewLabel', expectedTranslation: 'Choose month and year'},
				{labelName: 'comparisonDateLabel', expectedTranslation: 'Comparison range'}
			]
		},
		{
			language: 'it',
			labels: [
				{labelName: 'calendarLabel', expectedTranslation: 'Calendario'},
				{labelName: 'openCalendarLabel', expectedTranslation: 'Aprire il calendario'},
				{labelName: 'closeCalendarLabel', expectedTranslation: 'Chiudere il calendario'},
				{labelName: 'prevMonthLabel', expectedTranslation: 'Mese precedente'},
				{labelName: 'nextMonthLabel', expectedTranslation: 'Mese successivo'},
				{labelName: 'prevYearLabel', expectedTranslation: 'Anno precedente'},
				{labelName: 'nextYearLabel', expectedTranslation: 'Anno successivo'},
				{labelName: 'prevMultiYearLabel', expectedTranslation: '24 anni precedenti'},
				{labelName: 'nextMultiYearLabel', expectedTranslation: '24 anni successivi'},
				{labelName: 'switchToMonthViewLabel', expectedTranslation: 'Scegliere la data'},
				{labelName: 'switchToMultiYearViewLabel', expectedTranslation: "Scegliere il mese e l'anno'"},
				{labelName: 'comparisonDateLabel', expectedTranslation: 'Intervallo di confronto'}
			]
		},
		{
			language: 'de',
			labels: [
				{labelName: 'calendarLabel', expectedTranslation: 'Kalender'},
				{labelName: 'openCalendarLabel', expectedTranslation: 'Kalender öffnen'},
				{labelName: 'closeCalendarLabel', expectedTranslation: 'Kalender schliessen'},
				{labelName: 'prevMonthLabel', expectedTranslation: 'Vorheriger Monat'},
				{labelName: 'nextMonthLabel', expectedTranslation: 'Nächster Monat'},
				{labelName: 'prevYearLabel', expectedTranslation: 'Vorheriges Jahr'},
				{labelName: 'nextYearLabel', expectedTranslation: 'Nächstes Jahr'},
				{labelName: 'prevMultiYearLabel', expectedTranslation: 'Vorherige 24 Jahre'},
				{labelName: 'nextMultiYearLabel', expectedTranslation: 'Nächste 24 Jahre'},
				{labelName: 'switchToMonthViewLabel', expectedTranslation: 'Wähle ein Datum'},
				{labelName: 'switchToMultiYearViewLabel', expectedTranslation: 'Wähle ein Monat und Jahr'},
				{labelName: 'comparisonDateLabel', expectedTranslation: 'Vergleichsspanne'}
			]
		},
		{
			language: 'fr',
			labels: [
				{labelName: 'calendarLabel', expectedTranslation: 'Calendrier'},
				{labelName: 'openCalendarLabel', expectedTranslation: 'Ouvrir le calendrier'},
				{labelName: 'closeCalendarLabel', expectedTranslation: 'Fermer le calendrier'},
				{labelName: 'prevMonthLabel', expectedTranslation: 'Mois précédent'},
				{labelName: 'nextMonthLabel', expectedTranslation: 'Mois prochain'},
				{labelName: 'prevYearLabel', expectedTranslation: 'Année précédente'},
				{labelName: 'nextYearLabel', expectedTranslation: 'Année prochaine'},
				{labelName: 'prevMultiYearLabel', expectedTranslation: '24 années précédentes'},
				{labelName: 'nextMultiYearLabel', expectedTranslation: 'Prochaines 24 années'},
				{labelName: 'switchToMonthViewLabel', expectedTranslation: 'Choisir la date'},
				{labelName: 'switchToMultiYearViewLabel', expectedTranslation: "Choisir le mois et l'année"},
				{labelName: 'comparisonDateLabel', expectedTranslation: 'Plage de comparaison'}
			]
		}
	])(`labels for $language language`, ({language, labels}) => {
		beforeEach(() => {
			translateService.use(language);
		});

		it.each(labels)(`should translate $labelName`, item => {
			const translated = datepickerService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
