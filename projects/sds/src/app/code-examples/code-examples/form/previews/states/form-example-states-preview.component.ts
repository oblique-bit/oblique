import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-states-preview',
	templateUrl: './form-example-states-preview.component.html',
	styleUrl: './form-example-states-preview.component.scss',
	imports: [
		FormsModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatDatepickerModule,
		ObErrorMessagesModule
	]
})
export class FormExampleStatesPreviewComponent {}
