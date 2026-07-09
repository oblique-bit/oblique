import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, type NgForm, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ObNotificationService, provideObliqueTestingConfiguration} from '@oblique/oblique';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';

describe(SchemaValidationSampleComponent.name, () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslatePipe, FormsModule, ReactiveFormsModule],
			declarations: [SchemaValidationSampleComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SchemaValidationSampleComponent);
		component = fixture.componentInstance;
		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show a success notification for valid data', () => {
		const notification = TestBed.inject(ObNotificationService);
		jest.spyOn(notification, 'success');

		component.check();

		expect(notification.success).toHaveBeenCalledWith('Congratulations, your data is valid!');
	});

	it('should show a warning notification for invalid data', () => {
		const notification = TestBed.inject(ObNotificationService);
		jest.spyOn(notification, 'warning');
		const form = {valid: false} as NgForm;

		component.check(form);

		expect(notification.warning).toHaveBeenCalledWith('Oops, your data does not look to be valid!');
	});

	it('should reset the form', () => {
		jest.spyOn(component.formData, 'reset');

		component.reset();

		expect(component.formData.reset).toHaveBeenCalled();
	});

	it('should reset the provided form', () => {
		const form = {reset: jest.fn()} as unknown as NgForm;

		component.reset(form);

		expect(form.reset).toHaveBeenCalled();
	});

	it('should reject dates before today', () => {
		const dateField = component.materialTestForm.get('dateField');

		dateField.setValue(new Date(Date.now() - 86_400_000).toISOString());

		expect(dateField.errors.invalidDateMin).toBeDefined();
	});

	it('should accept dates after today', () => {
		const dateField = component.materialTestForm.get('dateField');

		dateField.setValue(new Date(Date.now() + 86_400_000).toISOString());

		expect(dateField.errors).toBeNull();
	});
});
