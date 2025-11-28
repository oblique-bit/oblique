import {Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {AutocompleteExampleDefaultComponent} from './previews/default/autocomplete-example-default.component';
import {AutocompleteExampleIconPositionStartComponent} from './previews/icon-position-start/autocomplete-example-icon-position-start.component';
import {AutocompleteExampleIconOptionsGroupComponent} from './previews/options-group/autocomplete-example-options-group.component';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {AutocompleteExampleHintsComponent} from './previews/hints/autocomplete-example-hints.component';

@Component({
	selector: 'app-autocomplete-code-examples',
	imports: [CommonModule, CodeExampleComponent, IdPipe],
	templateUrl: '../../code-examples.component.html',
})
export class AutocompleteCodeExamplesComponent extends CodeExamples {
	readonly previews: CodeExample[] = [
		{
			component: AutocompleteExampleDefaultComponent,
			idParts: ['autocomplete', 'default'],
			title: 'Autocomplete default',
			snippets: [
				this.getSnippet('autocomplete', 'default/autocomplete-example-default.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'default/autocomplete-example-default.component.ts', 'TS'),
			],
		},
		{
			component: AutocompleteExampleIconPositionStartComponent,
			idParts: ['autocomplete', 'icon', 'position', 'start'],
			title: 'Autocomplete icon position start',
			snippets: [
				this.getSnippet(
					'autocomplete',
					'icon-position-start/autocomplete-example-icon-position-start.component.html',
					'HTML'
				),
				this.getSnippet(
					'autocomplete',
					'icon-position-start/autocomplete-example-icon-position-start.component.ts',
					'TS'
				),
			],
		},
		{
			component: AutocompleteExampleIconOptionsGroupComponent,
			idParts: ['autocomplete', 'options', 'group'],
			title: 'Autocomplete options group',
			snippets: [
				this.getSnippet('autocomplete', 'options-group/autocomplete-example-options-group.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'options-group/autocomplete-example-options-group.component.ts', 'TS'),
			],
		},
		{
			component: AutocompleteExampleHintsComponent,
			idParts: ['autocomplete', 'hints'],
			title: 'Autocomplete hints',
			snippets: [
				this.getSnippet('autocomplete', 'hints/autocomplete-example-hints.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'hints/autocomplete-example-hints.component.ts', 'TS'),
			],
		},
	];
}
