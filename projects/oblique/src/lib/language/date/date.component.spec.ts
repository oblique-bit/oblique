import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import obliqueEn from '../../../assets/i18n/oblique-en.json';
import obliqueFr from '../../../assets/i18n/oblique-fr.json';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObLanguageService} from '../language.service';
import {ObDateComponent} from './date.component';
import {By} from '@angular/platform-browser';

registerLocaleData(localeFr);

describe('DateComponent', () => {
	let component: ObDateComponent;
	let fixture: ComponentFixture<ObDateComponent>;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObDateComponent],
			providers: [provideObliqueTestingConfiguration(), {provide: ObLanguageService}],
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

	test('creation', () => {
		expect(component).toBeTruthy();
	});

	test('default format', () => {
		fixture.componentRef.setInput('date', '2025-12-31');
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.css('time'));
		expect(element.nativeElement.textContent).toBe('December 31, 2025');
		expect(element.attributes.datetime).toBe('2025-12-31');
	});

	test('invalid date', () => {
		fixture.componentRef.setInput('date', '31-12-2025');
		fixture.componentRef.setInput('format', 'longDate');
		expect(component.formattedDate).toThrow(
			"Invalid date string received: 31-12-2025. Accepted date strings use one of the following formats: 'dd.MM.yyyy' or 'yyyy-MM-dd'"
		);
	});

	test('locale changes', () => {
		translateService.use('fr');
		fixture.componentRef.setInput('date', '2025-12-31');
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.css('time'));
		expect(element.nativeElement.textContent).toBe('31 décembre 2025');
		expect(element.attributes.datetime).toBe('2025-12-31');
	});

	describe.each(['2025-12-31', '31.12.2025', new Date('2025-12-31')])('with date: %s', input => {
		test.each([
			{format: `shortDate`, expectedFormat: '12/31/25'},
			{format: `mediumDate`, expectedFormat: 'Dec 31, 2025'},
			{format: `longDate`, expectedFormat: 'December 31, 2025'},
			{format: `fullDate`, expectedFormat: 'Wednesday, December 31, 2025'},
			{format: `yyyy-MM-dd`, expectedFormat: '2025-12-31'},
			{format: `isoDate`, expectedFormat: '2025-12-31'},
			{format: `longDate`, expectedFormat: 'December 31, 2025'},
		])('with format: $format', ({format, expectedFormat}) => {
			fixture.componentRef.setInput('date', input);
			fixture.componentRef.setInput('format', format);
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.css('time'));
			expect(element).toBeTruthy();
			expect(element.nativeElement.textContent).toBe(expectedFormat);
			expect(element.attributes.datetime).toBe('2025-12-31');
		});
	});
});
