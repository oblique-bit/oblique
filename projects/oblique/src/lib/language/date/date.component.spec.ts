import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import obliqueEn from '../../../assets/i18n/oblique-en.json';
import obliqueFr from '../../../assets/i18n/oblique-fr.json';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObLanguageService} from '../language.service';
import {ObDateComponent} from './date.component';

registerLocaleData(localeFr);

describe('DateComponent', () => {
	let component: ObDateComponent;
	let fixture: ComponentFixture<ObDateComponent>;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObDateComponent],
			providers: [provideObliqueTestingConfiguration(), {provide: ObLanguageService}]
		}).compileComponents();
		translateService = TestBed.inject(TranslateService);
		fixture = TestBed.createComponent(ObDateComponent);
		component = fixture.componentInstance;

		translateService.setTranslation('en', obliqueEn, true);
		translateService.setTranslation('fr', obliqueFr, true);
		translateService.use('en');

		fixture.componentRef.setInput('date', Date.now());
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe.each([
		{input: '2025-12-31', format: `shortDate`, expectedFormat: '12/31/25'},
		{input: '2025-12-31', format: `mediumDate`, expectedFormat: 'Dec 31, 2025'},
		{input: '2025-12-31', format: `longDate`, expectedFormat: 'December 31, 2025'},
		{input: '2025-12-31', format: `fullDate`, expectedFormat: 'Wednesday, December 31, 2025'},
		{input: '2025-12-31', format: `yyyy-MM-dd`, expectedFormat: '2025-12-31'},
		{input: '2025-12-31', format: `isoDate`, expectedFormat: '2025-12-31'},
		{input: '31.12.2025', format: `longDate`, expectedFormat: 'December 31, 2025'}
	])('correctly format date strings ', ({input, format, expectedFormat}) => {
		beforeEach(() => {
			fixture.componentRef.setInput('date', input);
			fixture.componentRef.setInput('format', format);
		});
		test(`input: ${input} with format: ${format}`, () => {
			expect(component.formattedDate()).toBe(expectedFormat);
		});
	});

	describe.each([
		{input: new Date('2025-12-31'), format: `shortDate`, expectedFormat: '12/31/25'},
		{input: new Date('2025-12-31'), format: `mediumDate`, expectedFormat: 'Dec 31, 2025'},
		{input: new Date('2025-12-31'), format: `longDate`, expectedFormat: 'December 31, 2025'},
		{input: new Date('2025-12-31'), format: `fullDate`, expectedFormat: 'Wednesday, December 31, 2025'},
		{input: new Date('2025-12-31'), format: `yyyy-MM-dd`, expectedFormat: '2025-12-31'},
		{input: new Date('2025-12-31'), format: `isoDate`, expectedFormat: '2025-12-31'}
	])('correctly format date objects ', ({input, format, expectedFormat}) => {
		beforeEach(() => {
			fixture.componentRef.setInput('date', input);
			fixture.componentRef.setInput('format', format);
		});
		test(`input: ${input.toString()} with format: ${format}`, () => {
			expect(component.formattedDate()).toBe(expectedFormat);
		});
	});

	it('should use longDate as default format', () => {
		fixture.componentRef.setInput('date', '2025-12-31');
		expect(component.formattedDate()).toBe('December 31, 2025');
	});

	it('should throw error with invalid date', () => {
		fixture.componentRef.setInput('date', '31-12-2025');
		fixture.componentRef.setInput('format', 'longDate');
		expect(component.formattedDate).toThrow(
			"Invalid date string received: 31-12-2025. Accepted date strings use one of the following formats: 'dd.MM.yyyy' or 'yyyy-MM-dd'"
		);
	});

	it('should react to locale changes', () => {
		translateService.use('fr');
		fixture.componentRef.setInput('date', '2025-12-31');
		expect(component.formattedDate()).toBe('31 décembre 2025');
	});
});
