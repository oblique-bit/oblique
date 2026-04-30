import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {VersionExampleDefaultPreviewComponent} from './previews/default/version-example-default-preview.component';

@Component({
	selector: 'app-code-example-version',
	imports: [IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'version-examples';
	readonly previews: CodeExample[] = [
		{
			component: VersionExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('version', 'default/version-example-default-preview.component.html', 'HTML'),
				this.getSnippet('version', 'default/version-example-default-preview.component.ts', 'TS'),
			],
		},
	];
}
