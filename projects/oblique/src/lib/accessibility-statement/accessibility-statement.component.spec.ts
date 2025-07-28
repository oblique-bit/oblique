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
					accessibilityStatement: {
						applicationName: 'appName',
						conformity: 'none',
						createdOn: new Date('2025-01-31'),
						applicationOperator: 'Operator',
						contact: [{email: 'e@mail.com'}]
					}
				})
			]
		}).compileComponents();
	});

	describe.each([{conformity: 'none'}, {conformity: 'full'}])('With "conformity" "$conformity"', ({conformity}) => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {
					applicationName: 'appName',
					applicationOperator: 'Operator',
					contact: [{email: 'e@mail.com'}],
					createdOn: new Date('2025-01-31'),
					conformity
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
				{tag: 'h2', number: 2},
				{tag: 'h3', number: 2},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 2},
				{tag: 'ol', number: 0},
				{tag: 'p', number: 6},
				{tag: 'p > a', number: 1}
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
				{property: 'conformity', value: `i18n.oblique.accessibility-statement.statement.${conformity}`},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.no-exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contacts', () => {
			test('to be defined', () => {
				expect(component.contacts).toBeDefined();
			});

			test('to be an array with correct properties', () => {
				expect(component.contacts).toEqual([{label: 'e@mail.com', url: `mailto:e@mail.com`, icon: 'mail', context: undefined}]);
			});
		});
	});

	describe('With "conformity" "partial"', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {
					applicationName: 'appName',
					applicationOperator: 'Operator',
					contact: [{email: 'e@mail.com'}],
					conformity: 'partial',
					createdOn: new Date('2025-01-31'),
					exceptions: ['test']
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
				{tag: 'h2', number: 2},
				{tag: 'h3', number: 3},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 2},
				{tag: 'ol', number: 1},
				{tag: 'p', number: 7},
				{tag: 'p > a', number: 1}
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
				{property: 'conformity', value: 'i18n.oblique.accessibility-statement.statement.partial'},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contacts', () => {
			test('to be defined', () => {
				expect(component.contacts).toBeDefined();
			});

			test('to be an array with correct properties', () => {
				expect(component.contacts).toEqual([{label: 'e@mail.com', url: `mailto:e@mail.com`, icon: 'mail', context: undefined}]);
			});
		});
	});

	describe('With "createdOn" info', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {
					applicationName: 'applicationName',
					applicationOperator: 'Operator',
					conformity: 'none',
					contact: [{email: 'e@mail.com'}],
					createdOn: new Date()
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
				{tag: 'h2', number: 2},
				{tag: 'h3', number: 2},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 2},
				{tag: 'ol', number: 0},
				{tag: 'p', number: 6},
				{tag: 'p > a', number: 1}
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
				{property: 'conformity', value: 'i18n.oblique.accessibility-statement.statement.none'},
				{property: 'exceptionText', value: 'i18n.oblique.accessibility-statement.statement.no-exception'}
			])('to have "$value" as "$property"', ({property, value}) => {
				expect(component.statementParameters[property]).toBe(value);
			});
		});

		describe('contacts', () => {
			test('to be defined', () => {
				expect(component.contacts).toBeDefined();
			});

			test('to be an array with correct properties', () => {
				expect(component.contacts).toEqual([{label: 'e@mail.com', url: `mailto:e@mail.com`, icon: 'mail', context: undefined}]);
			});
		});
	});

	describe('With "createdOn", "exceptions" and "contact" info', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, {
				useValue: {
					applicationName: 'applicationName',
					applicationOperator: 'Operator',
					conformity: 'partial',
					createdOn: new Date('2025-01-31'),
					contact: [{email: 'e@mail.com'}, {phone: 'phone', context: 'context'}],
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
				{tag: 'h2', number: 2},
				{tag: 'h3', number: 3},
				{tag: 'h4', number: 2},
				{tag: 'h5', number: 0},
				{tag: 'ul', number: 2},
				{tag: 'ol', number: 1},
				{tag: 'p', number: 7},
				{tag: 'p > a', number: 1}
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

		describe('contacts', () => {
			test('to be defined', () => {
				expect(component.contacts).toBeDefined();
			});

			test('to be an array with correct properties', () => {
				expect(component.contacts).toEqual([
					{label: 'e@mail.com', url: `mailto:e@mail.com`, icon: 'mail', context: undefined},
					{label: 'phone', url: `tel:phone`, icon: 'phone', context: 'context'}
				]);
			});
		});
	});
});
