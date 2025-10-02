import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObDatepickerIntlService} from './ob-datepicker.service';
import {provideObliqueTestingConfiguration} from '../utilities';
import obliqueEn from '../../assets/i18n/oblique-en.json';
import obliqueIt from '../../assets/i18n/oblique-it.json';
import obliqueDe from '../../assets/i18n/oblique-de.json';
import obliqueFr from '../../assets/i18n/oblique-fr.json';

describe('ObDatepickerIntlService', () => {
	let datepickerService: ObDatepickerIntlService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [ObDatepickerIntlService, provideObliqueTestingConfiguration()]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		datepickerService = TestBed.inject(ObDatepickerIntlService);
		translateService.setTranslation('en', obliqueEn, true);
		translateService.setTranslation('it', obliqueIt, true);
		translateService.setTranslation('de', obliqueDe, true);
		translateService.setTranslation('fr', obliqueFr, true);
		translateService.use('anything'); // this triggers loading of translations
		jest.spyOn(translateService, 'use');
		jest.spyOn(datepickerService.changes, 'next');
	});

	it('should be created', () => {
		expect(datepickerService).toBeTruthy();
	});

	it('should not have called translateService.use() yet', () => {
		expect(translateService.use).not.toHaveBeenCalled();
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
				{labelName: 'switchToMultiYearViewLabel', expectedTranslation: "Scegliere il mese e l'anno"},
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

		it('should have called translateService.use() once with the langugage param', () => {
			expect(translateService.use).toHaveBeenNthCalledWith(1, language);
		});

		it('should have called changes once', () => {
			expect(datepickerService.changes.next).toHaveBeenCalledTimes(1);
		});

		it.each(labels)(`should translate $labelName`, item => {
			const translated = datepickerService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
