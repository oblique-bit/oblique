import {Component, DebugElement, Directive} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {By} from '@angular/platform-browser';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {ObIconButtonDirective} from './icon-button.directive';

@Directive({
	selector: '[obButton]',
	hostDirectives: [ObIconButtonDirective]
})
export class ButtonTestDirective {}
@Component({
	imports: [MatButtonModule, ButtonTestDirective, MatIcon, MatTooltip],
	template: '<button type="button" obButton mat-icon-button matTooltip="tooltip"><mat-icon svgIcon="help" /></button>'
})
class ButtonTestComponent {}

let isDevModeEnabled = true;
jest.mock('@angular/core', () => ({
	...jest.requireActual('@angular/core'),
	isDevMode: jest.fn().mockImplementation(() => isDevModeEnabled)
}));

describe(ObIconButtonDirective.name, () => {
	let directive: ObIconButtonDirective;
	let fixture: ComponentFixture<ButtonTestComponent>;
	let button: DebugElement;

	describe.each([
		{mode: 'dev', isDevMode: true, warning: 'presence'},
		{mode: 'prod', isDevMode: false, warning: 'absence'}
	])('$mode mode', ({isDevMode, warning}) => {
		beforeEach(async () => {
			isDevModeEnabled = isDevMode;
			TestBed.resetTestingModule();
			await TestBed.configureTestingModule({
				imports: [MatButtonModule, ButtonTestComponent, MatIconModule]
			}).compileComponents();
			jest.spyOn(console, 'warn');
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		describe('without tooltip', () => {
			beforeEach(() => {
				fixture = TestBed.overrideComponent(ButtonTestComponent, {
					set: {template: '<button type="button" obButton mat-icon-button><mat-icon svgIcon="help" /></button>'}
				}).createComponent(ButtonTestComponent);
				button = fixture.debugElement.query(By.directive(ObIconButtonDirective));
				directive = button.injector.get(ObIconButtonDirective);
				fixture.detectChanges();
			});

			test('directive creation', () => {
				expect(directive).toBeDefined();
			});

			test(`missing tooltip warning ${warning}`, () => {
				if (isDevMode) {
					expect(console.warn).toHaveBeenCalledWith(
						'The following button lacks visible text. For improved usability and accessibility, consider adding a tooltip to clarify its purpose.',
						button.nativeElement
					);
				} else {
					expect(console.warn).not.toHaveBeenCalled();
				}
			});
		});

		describe('with tooltip', () => {
			beforeEach(() => {
				fixture = TestBed.createComponent(ButtonTestComponent);
				button = fixture.debugElement.query(By.directive(ObIconButtonDirective));
				directive = button.injector.get(ObIconButtonDirective);
				fixture.detectChanges();
			});

			test('directive creation', () => {
				expect(directive).toBeDefined();
			});

			test('no missing tooltip warning', () => {
				expect(console.warn).not.toHaveBeenCalled();
			});

			test('aria-labelledby value', () => {
				expect(button.attributes['aria-labelledby'].startsWith('cdk-describedby-message')).toBe(true);
			});

			test('aria-describedby absence', () => {
				expect(button.attributes['aria-describedby']).toBeUndefined();
			});
		});

		describe('with tooltip and aria-describedby', () => {
			beforeEach(() => {
				fixture = TestBed.overrideComponent(ButtonTestComponent, {
					set: {
						template:
							'<button type="button" obButton mat-icon-button aria-describedby="my-id" matTooltip="tooltip"><mat-icon svgIcon="help" /></button>'
					}
				}).createComponent(ButtonTestComponent);
				button = fixture.debugElement.query(By.directive(ObIconButtonDirective));
				directive = button.injector.get(ObIconButtonDirective);
				fixture.detectChanges();
			});

			test('directive creation', () => {
				expect(directive).toBeDefined();
			});

			test('no missing tooltip warning', () => {
				expect(console.warn).not.toHaveBeenCalled();
			});

			test('aria-labelledby value', () => {
				expect(button.attributes['aria-labelledby'].startsWith('cdk-describedby-message')).toBe(true);
			});

			test('aria-describedby value', () => {
				expect(button.attributes['aria-describedby']).toBe('my-id');
			});
		});
	});
});
