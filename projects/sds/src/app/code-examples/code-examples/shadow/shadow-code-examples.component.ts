import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ShadowExampleShadowPreviewComponent} from './previews/shadow/shadow-example-shadow-preview.component';

@Component({
	selector: 'app-code-example-shadow',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class ShadowCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'shadow-examples';
	readonly previews: CodeExample[] = [
		{
			component: ShadowExampleShadowPreviewComponent,
			idParts: ['shadow'],
			snippets: [
				this.getSnippet('shadow', 'shadow/shadow-example-shadow-preview.component.html', 'HTML'),
				this.getSnippet('shadow', 'shadow/shadow-example-shadow-preview.component.ts', 'TS'),
				this.getSnippet('shadow', 'shadow/shadow-example-shadow-preview.component.scss', 'SCSS')
			]
		}
	];
}
