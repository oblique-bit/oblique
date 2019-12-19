import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ErrorMessagesComponent, ErrorMessagesService, FormControlStateDirective} from 'oblique';
import {MockTranslateParamsModule} from '../translate-params/mock/mock-translate-params.module';

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
	@ViewChild(ErrorMessagesComponent, {static: false}) readonly errorMessages: ErrorMessagesComponent;
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

		errorMessagesServiceMock = {
			createMessages: jest.fn().mockImplementation(() => [{key: `i18n.validation.bar`, params: undefined}])
		};

		TestBed.configureTestingModule({
			declarations: [
				ErrorMessagesComponent,
				TestComponent
			],
			imports: [FormsModule, MockTranslateParamsModule],
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

	it('should render messages on submit', fakeAsync(() => {
		submitButton.click();
		tick(0);

		expect(component.errorMessages.errors.length).not.toBe(0);
		expect(errorMessagesServiceMock.createMessages).toHaveBeenCalled();
	}));

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
