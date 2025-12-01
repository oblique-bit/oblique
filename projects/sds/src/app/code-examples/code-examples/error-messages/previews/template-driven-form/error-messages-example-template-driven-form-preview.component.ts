import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'app-error-messages-example-template-driven-form-preview',
	imports: [MatFormFieldModule, MatInputModule, ObErrorMessagesModule, FormsModule],
	templateUrl: './error-messages-example-template-driven-form-preview.component.html',
})
export class ErrorMessagesExampleTemplateDrivenFormPreviewComponent {
	value = '';
}
