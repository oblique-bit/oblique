import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {AlertExampleInfoPreviewComponent} from './previews/info/alert-example-info-preview.component';
import {AlertExampleSuccessPreviewComponent} from './previews/success/alert-example-success-preview.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-code-example-alert',
	templateUrl: '../../code-examples.component.html',
	standalone: true,
	imports: [CommonModule, CodeExampleComponent, IdPipe]
})
export class AlertCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'alert-examples';
	readonly previews: CodeExample[] = [
		{
			component: AlertExampleInfoPreviewComponent,
			idParts: ['info'],
			title: 'Alert info',
			snippets: [
				this.getSnippet('alert', 'info/alert-example-info-preview.component.html', 'HTML'),
				this.getSnippet('alert', 'info/alert-example-info-preview.component.ts', 'TS')
			]
		},
		{
			component: AlertExampleSuccessPreviewComponent,
			idParts: ['success'],
			title: 'Alert success',
			snippets: [
				this.getSnippet('alert', 'success/alert-example-success-preview.component.html', 'HTML'),
				this.getSnippet('alert', 'success/alert-example-success-preview.component.ts', 'TS')
			]
		}
	];
}
