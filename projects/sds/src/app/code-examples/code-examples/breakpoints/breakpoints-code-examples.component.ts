import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {BreakpointsExampleUpPreviewComponent} from './previews/breakpoints/up/breakpoints-example-up-preview.component';
import {BreakpointsExampleDownPreviewComponent} from './previews/breakpoints/down/breakpoints-example-down-preview.component';

@Component({
	selector: 'app-code-example-breakpoints',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class BreakpointsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'breakpoints-examples';
	readonly previews: CodeExample[] = [
		{
			component: BreakpointsExampleUpPreviewComponent,
			idParts: ['ob-media-breakpoint-up'],
			title: 'ob-media-breakpoint-up',
			snippets: [
				this.getSnippet('breakpoints', 'breakpoints/up/breakpoints-example-up-preview.component.html', 'HTML'),
				this.getSnippet('breakpoints', 'breakpoints/up/breakpoints-example-up-preview.component.scss', 'SCSS')
			]
		},
		{
			component: BreakpointsExampleDownPreviewComponent,
			idParts: ['ob-media-breakpoint-down'],
			title: 'ob-media-breakpoint-down',
			snippets: [
				this.getSnippet('breakpoints', 'breakpoints/down/breakpoints-example-down-preview.component.html', 'HTML'),
				this.getSnippet('breakpoints', 'breakpoints/down/breakpoints-example-down-preview.component.scss', 'SCSS')
			]
		}
	];
}
