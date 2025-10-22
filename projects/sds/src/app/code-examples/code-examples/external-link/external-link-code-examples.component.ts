import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ExternalLinkExampleStackblitzLinkPreviewComponent} from '../external-link/previews/stackblitz-link/external-link-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-external-link',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalLinkCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'external-link-examples';
	readonly previews: CodeExample[] = [
		{
			component: ExternalLinkExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'ExternalLink stackblitzLink'
		}
	];
}
