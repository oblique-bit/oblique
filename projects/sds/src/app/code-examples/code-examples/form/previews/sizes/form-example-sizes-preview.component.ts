import {Component} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {ObDatepickerModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-sizes-preview',
	templateUrl: './form-example-sizes-preview.component.html',
	styleUrls: ['./form-example-sizes-preview.component.scss'],
	imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, ObDatepickerModule]
})
export class FormExampleSizesPreviewComponent {}
