import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MockTranslatePipe} from '../../../../testhelpers';
import {ErrorMessagesComponent} from './error-messages.component';
import {ErrorMessagesService} from './error-messages.service';
import {FormControlStateDirective} from '../form-control-state';

@Component({
	template: `
		<form name="testForm">
			<input name="name" type="text" ngModel #name="ngModel" required>
			<or-error-messages [control]="name"></or-error-messages>
			<input id="submit" type="submit" value="Click Me">
		</form>
	`
})
class TestComponent {
	@ViewChild(NgForm) form: NgForm;

	@ViewChild(ErrorMessagesComponent) errorMessages: ErrorMessagesComponent;
}

describe('ErrorMessagesComponent', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let formControlStateDirectiveMock;
	let errorMessagesServiceMock;
	let submitButton;

	//TODO: change this to a cleaner solution
	beforeAll(() => {
		formControlStateDirectiveMock = {
			pristineValidation: false
		};
	});

	beforeEach(async(() => {
		errorMessagesServiceMock = jasmine.createSpyObj('ErrorMessagesService', ['createMessages']);
		errorMessagesServiceMock.createMessages.and.callFake(() => {
			return [{
				key: `i18n.validation.bar`,
				params: undefined
			}];
		});

		TestBed.configureTestingModule({
			declarations: [
				ErrorMessagesComponent,
				TestComponent,
				MockTranslatePipe
			],
			imports: [
				CommonModule,
				FormsModule
			],
			providers: [
				{provide: ErrorMessagesService, useValue: errorMessagesServiceMock},
				{provide: FormControlStateDirective, useValue: formControlStateDirectiveMock}
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;
	}));

	it('should create', () => {
		expect(component).toBeDefined();
	});

	it('should render messages on submit', () => {
		submitButton.click();

		expect(component.errorMessages.errors.length).not.toBe(0);
		expect(errorMessagesServiceMock.createMessages).toHaveBeenCalled();
	});

	describe('with FormControlStateDirective.pristineValidation = true', () => {

		beforeAll(() => {
			formControlStateDirectiveMock.pristineValidation = true;
		});

		it('should render messages initially', () => {
			fixture.detectChanges();

			expect(component.errorMessages.errors.length).not.toBe(0);
			expect(errorMessagesServiceMock.createMessages).toHaveBeenCalled();
		});
	});
});
