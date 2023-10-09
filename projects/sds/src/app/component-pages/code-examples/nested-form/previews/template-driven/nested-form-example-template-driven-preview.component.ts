import {Component, inject} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {JsonPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObButtonModule, ObErrorMessagesModule, ObNestedFormModule, ObNotificationModule, ObNotificationService} from '@oblique/oblique';
import {NestedFormExampleTemplateDrivenPreviewChildComponent} from './child/nested-form-example-template-driven-preview-child.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-nested-form-example-template-driven-preview',
	templateUrl: './nested-form-example-template-driven-preview.component.html',
	styleUrls: ['../nested-form-example-preview.scss'],
	standalone: true,
	imports: [
		FormsModule,
		JsonPipe,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		NestedFormExampleTemplateDrivenPreviewChildComponent,
		ObButtonModule,
		ObErrorMessagesModule,
		ObNestedFormModule,
		ObNotificationModule,
		ReactiveFormsModule
	]
})
export class NestedFormExampleTemplateDrivenPreviewComponent implements PreviewComponent {
	readonly channel = 'template-driven-channel';
	readonly model = {
		parent: '',
		child: undefined
	};
	private readonly notification = inject(ObNotificationService);

	validateForm(ngForm: HTMLElement): void {
		this.notification.config.channel = this.channel;

		if (ngForm.className.includes('valid') && !ngForm.className.includes('invalid')) {
			this.notification.success('Form valid!');
		} else {
			this.notification.error('Form not valid!');
		}
	}
}
