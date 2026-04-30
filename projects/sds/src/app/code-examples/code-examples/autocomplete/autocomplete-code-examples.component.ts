import {Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {AutocompleteExampleDefaultComponent} from './previews/default/autocomplete-example-default.component';
import {AutocompleteExampleIconPositionStartComponent} from './previews/icon-position-start/autocomplete-example-icon-position-start.component';
import {AutocompleteExampleIconOptionsGroupComponent} from './previews/options-group/autocomplete-example-options-group.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {AutocompleteExampleFormComponent} from './previews/form/autocomplete-example-form.component';
import {AutocompleteExampleDisplayWithComponent} from './previews/display-with/autocomplete-example-display-with.component';
import {AutocompleteExampleAriaLabelComponent} from './previews/aria-label/autocomplete-example-aria-label.component';

@Component({
	selector: 'app-autocomplete-code-examples',
	imports: [CodeExampleComponent, IdPipe],
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
			component: AutocompleteExampleFormComponent,
			idParts: ['autocomplete', 'form'],
			title: 'Autocomplete in a form',
			snippets: [
				this.getSnippet('autocomplete', 'form/autocomplete-example-form.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'form/autocomplete-example-form.component.ts', 'TS'),
			],
		},
		{
			component: AutocompleteExampleDisplayWithComponent,
			idParts: ['autocomplete', 'options', 'display-with'],
			title: 'Autocomplete displayWith',
			snippets: [
				this.getSnippet('autocomplete', 'display-with/autocomplete-example-display-with.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'display-with/autocomplete-example-display-with.component.ts', 'TS'),
			],
		},
		{
			component: AutocompleteExampleAriaLabelComponent,
			idParts: ['autocomplete', 'ariaLabel'],
			title: 'Autocomplete ariaLabel',
			snippets: [
				this.getSnippet('autocomplete', 'aria-label/autocomplete-example-aria-label.component.html', 'HTML'),
				this.getSnippet('autocomplete', 'aria-label/autocomplete-example-aria-label.component.ts', 'TS'),
			],
		},
	];
}
