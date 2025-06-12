import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FormExampleSizesPreviewComponent} from '../form/previews/sizes/form-example-sizes-preview.component';
import {FormExampleStatesPreviewComponent} from './previews/states/form-example-states-preview.component';
import {FormExampleHorizontalPreviewComponent} from '../form/previews/horizontal/form-example-horizontal-preview.component';
import {FormExampleInputClearPreviewComponent} from '../form/previews/input-clear/form-example-input-clear-preview.component';
import {FormExampleInputPrefixesAndSuffixesPreviewComponent} from '../form/previews/input-prefixes-and-suffixes/form-example-input-prefixes-and-suffixes-preview.component';
import {DatepickerExampleOtherOptionsPreviewComponent} from './previews/other-options/datepicker-example-other-options-preview.component';

@Component({
	selector: 'app-code-example-form',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class FormCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'form-examples';
	readonly previews: CodeExample[] = [
		{
			component: FormExampleSizesPreviewComponent,
			idParts: ['sizes'],
			title: 'Sizes',
			snippets: [
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.html', 'HTML'),
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.ts', 'TS'),
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.scss', 'SCSS')
			]
		},
		{
			component: FormExampleStatesPreviewComponent,
			idParts: ['states'],
			title: 'States',
			snippets: [
				this.getSnippet('form', 'states/form-example-states-preview.component.html', 'HTML'),
				this.getSnippet('form', 'states/form-example-states-preview.component.ts', 'TS'),
				this.getSnippet('form', 'states/form-example-states-preview.component.scss', 'SCSS')
			]
		},
		{
			component: FormExampleHorizontalPreviewComponent,
			idParts: ['horizontal'],
			title: 'Horizontal',
			snippets: [
				this.getSnippet('form', 'horizontal/form-example-horizontal-preview.component.html', 'HTML'),
				this.getSnippet('form', 'horizontal/form-example-horizontal-preview.component.ts', 'TS')
			]
		},
		{
			component: FormExampleInputClearPreviewComponent,
			idParts: ['input', 'clear'],
			title: 'Input clear',
			snippets: [
				this.getSnippet('form', 'input-clear/form-example-input-clear-preview.component.html', 'HTML'),
				this.getSnippet('form', 'input-clear/form-example-input-clear-preview.component.ts', 'TS'),
				this.getSnippet('form', 'input-clear/form-example-input-clear-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: FormExampleInputPrefixesAndSuffixesPreviewComponent,
			idParts: ['input', 'prefixes', 'and', 'suffixes'],
			title: 'Input prefixes & suffixes',
			snippets: [
				this.getSnippet('form', 'input-prefixes-and-suffixes/form-example-input-prefixes-and-suffixes-preview.component.html', 'HTML'),
				this.getSnippet('form', 'input-prefixes-and-suffixes/form-example-input-prefixes-and-suffixes-preview.component.ts', 'TS'),
				this.getSnippet('form', 'input-prefixes-and-suffixes/form-example-input-prefixes-and-suffixes-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: DatepickerExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Additional datepicker options',
			snippets: [
				this.getSnippet('form', 'other-options/datepicker-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('form', 'other-options/datepicker-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
