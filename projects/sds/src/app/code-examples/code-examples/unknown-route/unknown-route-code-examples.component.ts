import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {UnknownRouteExampleStackblitzLinkPreviewComponent} from '../unknown-route/previews/stackblitz-link/unknown-route-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-unknown-route',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class UnknownRouteCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'unknown-route-examples';
	readonly previews: CodeExample[] = [
		{
			component: UnknownRouteExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: [
				this.getSnippet('unknown-route', 'stackblitz-link/unknown-route-example-stackblitz-link-preview.component.html', 'HTML'),
				this.getSnippet('unknown-route', 'stackblitz-link/unknown-route-example-stackblitz-link-preview.component.ts', 'TS')
			]
		}
	];
}
