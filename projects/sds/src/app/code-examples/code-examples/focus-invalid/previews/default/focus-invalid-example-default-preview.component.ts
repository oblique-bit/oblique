import {ObButtonModule, ObErrorMessagesDirective, ObFocusInvalidDirective, ObFormFieldModule, ObMatErrorDirective} from '@oblique/oblique';
import {MatSelectModule} from '@angular/material/select';
import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-focus-invalid-example-default-preview',
	templateUrl: './focus-invalid-example-default-preview.component.html',
	styleUrls: ['./focus-invalid-example-default-preview.component.scss'],
	imports: [
		MatButtonModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatCheckboxModule,
		MatSelectModule,
		ObFormFieldModule,
		ObButtonModule,
		ReactiveFormsModule,
		ObErrorMessagesDirective,
		ObFocusInvalidDirective,
		ObMatErrorDirective,
		ObErrorMessagesDirective,
		ObFocusInvalidDirective,
		ObMatErrorDirective
	]
})
export class FocusInvalidExampleDefaultPreviewComponent implements OnInit {
	focusInvalidFormGroup: FormGroup;
	private readonly formBuilder: FormBuilder = inject(FormBuilder);

	ngOnInit(): void {
		this.focusInvalidFormGroup = this.formBuilder.group({
			text: ['', Validators.required],
			datepicker: ['', Validators.required],
			select: ['', Validators.required],
			textarea: ['', Validators.required],
			checkbox: [null, Validators.requiredTrue],
			radio: [null, Validators.required]
		});
	}
}
