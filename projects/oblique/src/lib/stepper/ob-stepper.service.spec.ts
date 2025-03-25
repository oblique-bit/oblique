import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService, provideTranslateService} from '@ngx-translate/core';
import {ObStepperIntlService} from './ob-stepper.service';

describe('ObStepperIntlService', () => {
	let stepperService: ObStepperIntlService;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule],
			providers: [ObStepperIntlService, provideTranslateService()]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		stepperService = TestBed.inject(ObStepperIntlService);
		translateService.setTranslation('en', {
			'i18n.stepper.optional.label': 'Optional',
			'i18n.stepper.completed.label': 'Completed',
			'i18n.stepper.editable.label': 'Editable'
		});
		translateService.setTranslation('de', {
			'i18n.stepper.optional.label': 'Optional',
			'i18n.stepper.completed.label': 'Abgeschlossen',
			'i18n.stepper.editable.label': 'Editierbar'
		});
		translateService.setTranslation('fr', {
			'i18n.stepper.optional.label': 'Optionnel',
			'i18n.stepper.completed.label': 'Terminé',
			'i18n.stepper.editable.label': 'Modifiable'
		});
		translateService.setTranslation('it', {
			'i18n.stepper.optional.label': 'Opzionale',
			'i18n.stepper.completed.label': 'Completato',
			'i18n.stepper.editable.label': 'Modificabile'
		});
		translateService.use('en');
	});

	it('should be created', () => {
		expect(stepperService).toBeTruthy();
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

		it.each(labels)(`should translate $labelName`, item => {
			const translated = stepperService[item.labelName];
			expect(translated).toBe(item.expectedTranslation);
		});
	});
});
