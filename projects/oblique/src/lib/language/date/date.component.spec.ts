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
		expect(element.nativeElement.textContent).toBe('31 December 2025');
		expect(element.attributes.datetime).toBe('2025-12-31');
	});

	test('invalid date', () => {
		fixture.componentRef.setInput('date', '32-12-2025');
		fixture.componentRef.setInput('format', 'longDate');
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.css('time'));
		expect(element.nativeElement.textContent).toBe('');
		expect(element.attributes.datetime).toBeUndefined();
	});

	test('locale changes', () => {
		translateService.use('fr');
		fixture.componentRef.setInput('date', '2025-12-31');
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.css('time'));
		expect(element.nativeElement.textContent).toBe('31 décembre 2025');
		expect(element.attributes.datetime).toBe('2025-12-31');
	});

	describe.each(['2025-12-31', '31.12.2025', new Date('2025-12-30T23:00:00Z')])('with date: %s', input => {
		test.each([
			{format: `shortDate`, expectedFormat: '31.12.2025'},
			{format: `mediumDate`, expectedFormat: '31 Dec 2025'},
			{format: `longDate`, expectedFormat: '31 December 2025'},
			{format: `fullDate`, expectedFormat: 'Wednesday, 31 December 2025'},
			{format: `isoDate`, expectedFormat: '2025-12-31'},
			{
				format: `shortDate`,
				timeFormat: 'shortTime',
				expectedFormat: '31.12.2025, 00:00',
				expectedIso: '2025-12-31T00:00',
			},
			{
				format: `mediumDate`,
				timeFormat: 'mediumTime',
				expectedFormat: '31 Dec 2025, 00:00:00',
				expectedIso: '2025-12-31T00:00:00',
			},
			{
				format: `longDate`,
				timeFormat: 'longTime',
				expectedFormat: '31 December 2025 at 00:00:00.000',
				expectedIso: '2025-12-31T00:00:00.000',
			},
			{
				format: `fullDate`,
				timeFormat: 'shortTime',
				expectedFormat: 'Wednesday, 31 December 2025 at 00:00',
				expectedIso: '2025-12-31T00:00',
			},
			{
				format: `isoDate`,
				timeFormat: 'mediumTime',
				expectedFormat: '2025-12-31T00:00:00',
				expectedIso: '2025-12-31T00:00:00',
			},
		])('with format: $format, timeFormat: $timeFormat', ({format, timeFormat, expectedFormat, expectedIso}) => {
			fixture.componentRef.setInput('date', input);
			fixture.componentRef.setInput('format', format);
			fixture.componentRef.setInput('timeFormat', timeFormat);
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.css('time'));
			expect(element).toBeTruthy();
			expect(element.nativeElement.textContent).toBe(expectedFormat);
			expect(element.attributes.datetime).toBe(expectedIso ?? '2025-12-31');
		});
	});
});
