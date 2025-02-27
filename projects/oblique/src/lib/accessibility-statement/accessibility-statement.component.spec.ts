import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, provideObliqueConfiguration} from '../utilities';
import {AccessibilityStatementComponent} from './accessibility-statement.component';
import {registerLocaleData} from '@angular/common';
import localeDE from '@angular/common/locales/de-CH';
import {By} from '@angular/platform-browser';

registerLocaleData(localeDE);

describe(AccessibilityStatementComponent.name, () => {
	let component: AccessibilityStatementComponent;
	let fixture: ComponentFixture<AccessibilityStatementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AccessibilityStatementComponent, TranslateModule],
			providers: [
				provideHttpClient(),
				provideObliqueConfiguration({
					accessibilityStatement: {applicationName: 'appName', applicationOperator: 'Operator', contact: {emails: ['e@mail.com']}}
				})
			]
		}).compileComponents();
	});

	describe('With minimal configuration', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(AccessibilityStatementComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		test('component creation', () => {
			expect(component).toBeTruthy();
		});

		describe('template', () => {
			test.each([
				{tag: 'h1', number: 1},
				{tag: 'h2', number: 3},
				{tag: 'h3', number: 3},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 4},
				{tag: 'ol', number: 0},
				{tag: 'p', number: 5}
			])('has $number "$tag" tags', ({tag, number}) => {
				expect(fixture.debugElement.queryAll(By.css(tag)).length).toBe(number);
			});
		});

		describe('statementParameters', () => {
			test('to be defined', () => {
				expect(component.statementParameters).toBeDefined();
			});

			test.each([
				{property: 'applicationName', value: 'appName'},
				{property: 'conformity', value: 'i18n.oblique.accessibility-statement.statement.none'},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.no-exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contactParameters', () => {
			test('to be defined', () => {
				expect(component.contactParameters).toBeDefined();
			});

			test.each([
				{property: 'emails', value: ['e@mail.com']},
				{property: 'phones', value: []}
			])('to have an empty array as "$property"', ({property, value}) => {
				expect(component.contactParameters[property]).toEqual(value);
			});
		});

		describe('generalLinks', () => {
			test('to be defined', () => {
				expect(component.generalLinks).toBeDefined();
			});

			test('to have 2 items', () => {
				expect(component.generalLinks.length).toBe(2);
			});
		});

		describe('accessibilityLinks', () => {
			test('to be defined', () => {
				expect(component.accessibilityLinks).toBeDefined();
			});

			test('to have 6 items', () => {
				expect(component.accessibilityLinks.length).toBe(6);
			});
		});
	});

	describe('With "createdOn" info', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {applicationName: 'applicationName', applicationOperator: 'Operator', contact: {}, createdOn: new Date()}
			});
			fixture = TestBed.createComponent(AccessibilityStatementComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		test('component creation', () => {
			expect(component).toBeTruthy();
		});

		describe('template', () => {
			test.each([
				{tag: 'h1', number: 1},
				{tag: 'h2', number: 3},
				{tag: 'h3', number: 4},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 4},
				{tag: 'ol', number: 0},
				{tag: 'p', number: 6}
			])('has $number "$tag" tags', ({tag, number}) => {
				expect(fixture.debugElement.queryAll(By.css(tag)).length).toBe(number);
			});
		});

		describe('statementParameters', () => {
			test('to be defined', () => {
				expect(component.statementParameters).toBeDefined();
			});

			test.each([
				{property: 'applicationName', value: 'applicationName'},
				{property: 'conformity', value: 'i18n.oblique.accessibility-statement.statement.full'},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.no-exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contactParameters', () => {
			test('to be defined', () => {
				expect(component.contactParameters).toBeDefined();
			});

			test.each([{property: 'emails'}, {property: 'phones'}])('to have an empty array as "$property"', ({property}) => {
				expect(component.contactParameters[property]).toEqual([]);
			});
		});

		describe('generalLinks', () => {
			test('to be defined', () => {
				expect(component.generalLinks).toBeDefined();
			});

			test('to have 2 items', () => {
				expect(component.generalLinks.length).toBe(2);
			});
		});

		describe('accessibilityLinks', () => {
			test('to be defined', () => {
				expect(component.accessibilityLinks).toBeDefined();
			});

			test('to have 6 items', () => {
				expect(component.accessibilityLinks.length).toBe(6);
			});
		});
	});

	describe('With "createdOn", "exceptions" and "contact" info', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {
					applicationName: 'applicationName',
					applicationOperator: 'Operator',
					contact: {emails: ['email'], phones: ['phone']},
					createdOn: new Date(),
					exceptions: ['exception']
				}
			});
			fixture = TestBed.createComponent(AccessibilityStatementComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		test('component creation', () => {
			expect(component).toBeTruthy();
		});

		describe('template', () => {
			test.each([
				{tag: 'h1', number: 1},
				{tag: 'h2', number: 3},
				{tag: 'h3', number: 5},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 4},
				{tag: 'ol', number: 1},
				{tag: 'p', number: 7}
			])('has $number "$tag" tags', ({tag, number}) => {
				expect(fixture.debugElement.queryAll(By.css(tag)).length).toBe(number);
			});
		});

		describe('statementParameters', () => {
			test('to be defined', () => {
				expect(component.statementParameters).toBeDefined();
			});

			test.each([
				{property: 'applicationName', value: 'applicationName'},
				{property: 'conformity', value: 'i18n.oblique.accessibility-statement.statement.partial'},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contactParameters', () => {
			test('to be defined', () => {
				expect(component.contactParameters).toBeDefined();
			});

			test.each([
				{property: 'emails', value: ['email']},
				{property: 'phones', value: ['phone']}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.contactParameters[property]).toEqual(value);
			});
		});

		describe('generalLinks', () => {
			test('to be defined', () => {
				expect(component.generalLinks).toBeDefined();
			});

			test('to have 2 items', () => {
				expect(component.generalLinks.length).toBe(2);
			});
		});

		describe('accessibilityLinks', () => {
			test('to be defined', () => {
				expect(component.accessibilityLinks).toBeDefined();
			});

			test('to have 6 items', () => {
				expect(component.accessibilityLinks.length).toBe(6);
			});
		});
	});
});
