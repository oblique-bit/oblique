import {Component} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {ObFormFieldModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-sizes-preview',
	templateUrl: './form-example-sizes-preview.component.html',
	styleUrls: ['./form-example-sizes-preview.component.scss'],
	standalone: true,
	imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, ObFormFieldModule, MatDatepickerModule]
})
export class FormExampleSizesPreviewComponent {}
