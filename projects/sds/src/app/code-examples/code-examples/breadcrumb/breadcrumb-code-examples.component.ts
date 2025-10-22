import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {BreadcrumbExampleDefaultPreviewComponent} from '../breadcrumb/previews/default/breadcrumb-example-default-preview.component';

@Component({
	selector: 'app-code-example-breadcrumb',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'breadcrumb-examples';
	readonly previews: CodeExample[] = [
		{
			component: BreadcrumbExampleDefaultPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example'
		}
	];
}
