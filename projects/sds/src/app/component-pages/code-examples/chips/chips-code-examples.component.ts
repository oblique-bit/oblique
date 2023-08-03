import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {ChipsExampleColorPreviewComponent} from './previews/color/chips-example-color-preview.component';
import {ChipsExampleAutocompletePreviewComponent} from './previews/autocomplete/chips-example-autocomplete-preview.component';
import {ChipsExampleStackPreviewComponent} from './previews/stack/chips-example-stack-preview.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class ChipsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'chips-examples';
	readonly directory: string = 'chips';

	readonly previews: CodeExample[] = [
		{
			component: ChipsExampleColorPreviewComponent,
			idParts: ['color'],
			title: 'Colors',
			snippets: [
				this.getSnippet(this.directory, 'color/chips-example-color-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'color/chips-example-color-preview.component.ts', 'TS')
			]
		},
		{
			component: ChipsExampleStackPreviewComponent,
			idParts: ['stack'],
			title: 'Stacked',
			snippets: [
				this.getSnippet(this.directory, 'stack/chips-example-stack-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'stack/chips-example-stack-preview.component.ts', 'TS'),
				this.getSnippet(this.directory, 'stack/chips-example-stack-preview.component.scss', 'SCSS')
			]
		},
		{
			component: ChipsExampleAutocompletePreviewComponent,
			idParts: ['autocomplete'],
			title: 'Chips autocomplete',
			snippets: [
				this.getSnippet(this.directory, 'autocomplete/chips-example-autocomplete-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'autocomplete/chips-example-autocomplete-preview.component.ts', 'TS')
			]
		}
	];
}
