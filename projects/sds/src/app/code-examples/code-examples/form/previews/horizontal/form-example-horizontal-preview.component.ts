import {Component} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

@Component({
	selector: 'app-form-example-horizontal-preview',
	templateUrl: './form-example-horizontal-preview.component.html',
	imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule]
})
export class FormExampleHorizontalPreviewComponent {}
