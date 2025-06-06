import {Component, viewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'app-nested-form-example-template-driven-preview-grandchild',
	exportAs: 'grandchild',
	templateUrl: './nested-form-example-template-driven-preview-grandchild.component.html',
	styleUrl: '../../nested-form-example-preview.scss',
	imports: [FormsModule, MatInputModule, MatFormFieldModule, ObErrorMessagesModule]
})
export class NestedFormExampleTemplateDrivenPreviewGrandchildComponent {
	readonly ngForm = viewChild(NgForm);
	field1 = '';
	field2 = '';
}
