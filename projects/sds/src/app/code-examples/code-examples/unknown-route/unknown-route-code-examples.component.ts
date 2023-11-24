import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {UnknownRouteExampleDefaultPreviewComponent} from './previews/default/unknown-route-example-default-preview.component';

@Component({
	selector: 'app-code-example-unknown-route',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class UnknownRouteCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'unknown-route-examples';
	readonly previews: CodeExample[] = [
		{
			component: UnknownRouteExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'UnknownRoute',
			snippets: [
				this.getSnippet('unknown-route', 'default/unknown-route-example-default-preview.component.html', 'HTML'),
				this.getSnippet('unknown-route', 'default/unknown-route-example-default-preview.component.ts', 'TS')
			]
		}
	];
}
