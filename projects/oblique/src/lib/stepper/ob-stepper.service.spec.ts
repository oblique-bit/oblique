import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService, provideTranslateService} from '@ngx-translate/core';
import {ObStepperIntlService} from './ob-stepper.service';
import {provideObliqueConfiguration} from '../utilities';
import {provideHttpClient} from '@angular/common/http';
import obliqueEn from '../../assets/i18n/oblique-en.json';
import obliqueIt from '../../assets/i18n/oblique-it.json';
import obliqueDe from '../../assets/i18n/oblique-de.json';
import obliqueFr from '../../assets/i18n/oblique-fr.json';

describe('ObStepperIntlService', () => {
	let stepperService: ObStepperIntlService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule],
			providers: [
				ObStepperIntlService,
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
		stepperService = TestBed.inject(ObStepperIntlService);
		translateService.setTranslation('en', obliqueEn, true);
		translateService.setTranslation('it', obliqueIt, true);
		translateService.setTranslation('de', obliqueDe, true);
		translateService.setTranslation('fr', obliqueFr, true);
		jest.spyOn(translateService, 'use');
		jest.spyOn(stepperService.changes, 'next');
	});

	it('should be created', () => {
		expect(stepperService).toBeTruthy();
	});

	it('should not have called translateService.use() yet', () => {
		expect(translateService.use).not.toHaveBeenCalled();
	});

	describe.each([
		{
			language: 'en',
			labels: [
				{labelName: 'optionalLabel', expectedTranslation: 'Optional'},
				{labelName: 'completedLabel', expectedTranslation: 'Completed'},
				{labelName: 'editableLabel', expectedTranslation: 'Editable'}
			]
		},
		{
			language: 'it',
			labels: [
				{labelName: 'optionalLabel', expectedTranslation: 'Opzionale'},
				{labelName: 'completedLabel', expectedTranslation: 'Completato'},
				{labelName: 'editableLabel', expectedTranslation: 'Modificabile'}
			]
		},
		{
			language: 'de',
			labels: [
				{labelName: 'optionalLabel', expectedTranslation: 'Optional'},
				{labelName: 'completedLabel', expectedTranslation: 'Abgeschlossen'},
				{labelName: 'editableLabel', expectedTranslation: 'Editierbar'}
			]
		},
		{
			language: 'fr',
			labels: [
				{labelName: 'optionalLabel', expectedTranslation: 'Optionnel'},
				{labelName: 'completedLabel', expectedTranslation: 'Terminé'},
				{labelName: 'editableLabel', expectedTranslation: 'Modifiable'}
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
			expect(stepperService.changes.next).toHaveBeenCalledTimes(1);
		});

		it.each(labels)(`should translate $labelName`, item => {
			const translated = stepperService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
