import {Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {AlertExampleInfoPreviewComponent} from './previews/info/alert-example-info-preview.component';
import {AlertExampleSuccessPreviewComponent} from './previews/success/alert-example-success-preview.component';

@Component({
	selector: 'app-code-example-alert',
	templateUrl: './alert-code-examples.component.html'
})
export class AlertCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'alert-examples';
	readonly previews: CodeExample[] = [
		{
			component: AlertExampleInfoPreviewComponent,
			idParts: ['info'],
			snippets: [this.getSnippet('alert', 'info/alert-example-info-preview.component.html', 'HTML')]
		},
		{
			component: AlertExampleSuccessPreviewComponent,
			idParts: ['success'],
			snippets: [this.getSnippet('alert', 'success/alert-example-success-preview.component.html', 'HTML')]
		}
	];
}
