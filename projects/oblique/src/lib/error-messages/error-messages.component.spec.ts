import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObErrorMessagesComponent, ObErrorMessagesService, ObFormControlStateDirective} from 'oblique';
import {ObMockTranslateParamsModule} from '../translate-params/mock/mock-translate-params.module';

@Component({
	template: `
		<form name="testForm">
			<input name="name" type="text" ngModel #name="ngModel" required />
			<ob-error-messages [control]="name"></ob-error-messages>
			<input id="submit" type="submit" value="Click Me" />
		</form>
	`
})
class TestComponent {
	@ViewChild(ObErrorMessagesComponent, {static: false}) readonly errorMessages: ObErrorMessagesComponent;
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
			createMessages: jest.fn().mockImplementation(() => [{key: 'i18n.validation.bar', params: undefined}])
		};

		TestBed.configureTestingModule({
			declarations: [ObErrorMessagesComponent, TestComponent],
			imports: [FormsModule, ObMockTranslateParamsModule],
			providers: [
				{provide: ObErrorMessagesService, useValue: errorMessagesServiceMock},
				{provide: ObFormControlStateDirective, useValue: formControlStateDirectiveMock}
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
