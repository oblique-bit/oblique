import {MatFormFieldModule} from '@angular/material/form-field';
import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm, NgModel} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule, ObNestedFormModule} from '@oblique/oblique';
import {NestedFormExampleTemplateDrivenPreviewGrandchildComponent} from '../grandchild/nested-form-example-template-driven-preview-grandchild.component';

@Component({
	selector: 'app-nested-form-example-template-driven-preview-child',
	exportAs: 'child',
	templateUrl: './nested-form-example-template-driven-preview-child.component.html',
	standalone: true,
	imports: [
		FormsModule,
		MatInputModule,
		MatFormFieldModule,
		NestedFormExampleTemplateDrivenPreviewGrandchildComponent,
		ObErrorMessagesModule,
		ObNestedFormModule
	]
})
export class NestedFormExampleTemplateDrivenPreviewChildComponent {
	@ViewChild(NgForm, {static: true}) ngForm: NgForm;
	field1 = '';
	field2 = '';
	grandchildModel: NgModel;
}
