import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {PaginatorComponent} from './previews/paginator/paginator.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, CodeExampleComponent, IdPipe]
})
export class PaginatorCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'button-examples';
	readonly previews: CodeExample[] = [
		{
			component: PaginatorComponent,
			idParts: ['paginator'],
			title: 'Paginator',
			snippets: [
				this.getSnippet('paginator', 'paginator/paginator.component.html', 'HTML'),
				this.getSnippet('paginator', 'paginator/paginator.component.ts', 'TS')
			]
		}
	];
}
