import {Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {AlertExampleTypePreviewComponent} from './previews/type/alert-example-type-preview.component';
import {AlertExampleHasRoleAlertPreviewComponent} from './previews/has-role-alert/alert-example-has-role-alert-preview.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-code-example-alert',
	imports: [CodeExampleComponent, IdPipe],
	templateUrl: '../../code-examples.component.html'
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
				this.getSnippet('alert', 'type/alert-example-type-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: AlertExampleHasRoleAlertPreviewComponent,
			idParts: ['has', 'role', 'alert'],
			title: 'ARIA: alert role [hasRoleAlert]',
			snippets: [
				this.getSnippet('alert', 'has-role-alert/alert-example-has-role-alert-preview.component.html', 'HTML'),
				this.getSnippet('alert', 'has-role-alert/alert-example-has-role-alert-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
