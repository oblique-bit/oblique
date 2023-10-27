import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {AlertExampleTypePreviewComponent} from './previews/type/alert-example-type-preview.component';
import {AlertExampleHasRoleAlertPreviewComponent} from './previews/has-role-alert/alert-example-has-role-alert-preview.component';
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
			component: AlertExampleTypePreviewComponent,
			idParts: ['type'],
			title: 'Types [type]',
			snippets: [
				this.getSnippet('alert', 'type/alert-example-type-preview.component.html', 'HTML'),
				this.getSnippet('alert', 'type/alert-example-type-preview.component.ts', 'TS')
			]
		},
		{
			component: AlertExampleHasRoleAlertPreviewComponent,
			idParts: ['has', 'role', 'alert'],
			title: 'ARIA: alert role [hasRoleAlert]',
			snippets: [
				this.getSnippet('alert', 'has-role-alert/alert-example-has-role-alert-preview.component.html', 'HTML'),
				this.getSnippet('alert', 'has-role-alert/alert-example-has-role-alert-preview.component.ts', 'TS')
			]
		}
	];
}
