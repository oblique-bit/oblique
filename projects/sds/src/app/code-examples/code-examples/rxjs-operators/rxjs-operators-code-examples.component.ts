import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {RxjsOperatorsExampleDefaultPreviewComponent} from './previews/default/rxjs-operators-example-default-preview.component';

@Component({
	selector: 'app-code-example-rxjs-operators',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class RxjsOperatorsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'rxjs-operators-examples';
	readonly previews: CodeExample[] = [
		{
			component: RxjsOperatorsExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'obPauseWhenPageHidden',
			snippets: [
				this.getSnippet('rxjs-operators', 'default/rxjs-operators-example-default-preview.component.html', 'HTML'),
				this.getSnippet('rxjs-operators', 'default/rxjs-operators-example-default-preview.component.ts', 'TS')
			]
		}
	];
}
