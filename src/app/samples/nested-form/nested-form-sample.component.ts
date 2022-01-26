import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ObNotificationService} from '@oblique/oblique';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-nested-form-sample',
	templateUrl: './nested-form-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormSampleComponent {
	parentForm: FormGroup;
	model = {
		parent: '',
		child: undefined
	};
	material: Observable<boolean>;
	@ViewChild(FormGroupDirective) reactiveForm: FormGroupDirective;
	@ViewChild(NgForm) templateForm: NgForm;

	constructor(private readonly fb: FormBuilder, private readonly notification: ObNotificationService, theme: ThemeService) {
		this.parentForm = this.fb.group({
			child: [''],
			parent: ['', [Validators.required]]
		});
		this.material = theme.theme$.pipe(
			map(() => theme.isMaterial()),
			tap(() => this.templateForm?.resetForm()),
			tap(() => this.reactiveForm?.resetForm())
		);
	}

	validateForm(valid: boolean): void {
		// eslint-disable-next-line no-unused-expressions
		valid ? this.notification.success('Form valid!') : this.notification.error('Form not valid!');
	}

	resetForm(): void {
		this.parentForm.reset();
	}
}
