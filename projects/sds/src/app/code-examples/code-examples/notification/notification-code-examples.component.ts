import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NotificationExampleDefaultPreviewComponent} from '../notification/previews/default/notification-example-default-preview.component';
import {NotificationExampleOtherOptionsPreviewComponent} from '../notification/previews/other-options/notification-example-other-options-preview.component';

@Component({
	selector: 'app-code-example-notification',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'notification-examples';
	readonly previews: CodeExample[] = [
		{
			component: NotificationExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('notification', 'default/notification-example-default-preview.component.html', 'HTML'),
				this.getSnippet('notification', 'default/notification-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: NotificationExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('notification', 'other-options/notification-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('notification', 'other-options/notification-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('notification', 'other-options/notification-example-other-options-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
