import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {ObNumberFormatModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-number-format-example-default-with-template-from-preview',
	templateUrl: './number-format-example-default-with-template-from-preview.component.html',
	standalone: true,
	imports: [FormsModule, MatFormFieldModule, MatInputModule, ObNumberFormatModule],
	styleUrls: ['../../../../code-example-flex-layout.scss']
})
export class NumberFormatExampleDefaultWithTemplateFromPreviewComponent {
	exampleTemplateForm = 5.236548;
}
