import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObAvailableInComponent} from './available-in.component';
import {provideObliqueConfiguration} from '../../utilities';
import {provideHttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

describe(ObAvailableInComponent.name, () => {
	let component: ObAvailableInComponent;
	let fixture: ComponentFixture<ObAvailableInComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObAvailableInComponent],
			providers: [
				provideHttpClient(),
				provideObliqueConfiguration({
					accessibilityStatement: {
						applicationName: '',
						conformity: 'none',
						applicationOperator: '',
						contact: undefined
					}
				})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ObAvailableInComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(async () => {
		await firstValueFrom(TestBed.inject(TranslateService).use('it'));
	});

	test('creation', () => {
		expect(component).toBeTruthy();
	});

	test('default value', () => {
		fixture.componentRef.setInput('languages', undefined);
		expect(component.languages()).toEqual([]);
	});

	test('without language', () => {
		expect(fixture.debugElement.nativeElement.textContent).toBe('');
	});

	test.each([
		{languages: ['es'], result: 'i18n.common.in i18n.common.es'},
		{languages: ['fr'], result: 'i18n.common.in i18n.common.french'},
		{languages: ['fr', 'en'], result: 'i18n.common.in i18n.common.french i18n.common.and i18n.common.english'},
		{languages: ['fr', 'en', 'de'], result: 'i18n.common.in i18n.common.french, i18n.common.english i18n.common.and i18n.common.german'},
		{languages: ['it'], result: ''},
		{languages: ['it', 'en'], result: ''},
		{languages: ['it', 'en', 'de'], result: ''}
	])('with $languages as languages', ({languages, result}) => {
		fixture.componentRef.setInput('languages', languages);
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.textContent).toBe(result);
	});
});
