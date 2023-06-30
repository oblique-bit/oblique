import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {PaginatorComponent} from './previews/paginator/paginator.component';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'button-examples';
	readonly previews: CodeExample[] = [
		{
			component: PaginatorComponent,
			idParts: ['paginator'],
			title: 'Paginator',
			snippets: [this.getSnippet('paginator', 'paginator/paginator.component.html', 'HTML')]
		}
	];
}
