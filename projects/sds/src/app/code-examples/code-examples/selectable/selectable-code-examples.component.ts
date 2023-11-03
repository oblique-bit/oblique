import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SelectableExampleCheckboxPreviewComponent} from '../selectable/previews/checkbox/selectable-example-checkbox-preview.component';
import {SelectableExampleRadioPreviewComponent} from '../selectable/previews/radio/selectable-example-radio-preview.component';
import {SelectableExampleWindowsPreviewComponent} from '../selectable/previews/windows/selectable-example-windows-preview.component';

@Component({
	selector: 'app-code-example-selectable',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class SelectableCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'selectable-examples';
	readonly previews: CodeExample[] = [
		{
			component: SelectableExampleCheckboxPreviewComponent,
			idParts: ['checkbox'],
			title: 'Checkbox mode',
			snippets: [
				this.getSnippet('selectable', 'checkbox/selectable-example-checkbox-preview.component.html', 'HTML'),
				this.getSnippet('selectable', 'checkbox/selectable-example-checkbox-preview.component.ts', 'TS'),
				this.getSnippet('selectable', 'selectable-example-preview.component.scss', 'SCSS')
			]
		},
		{
			component: SelectableExampleRadioPreviewComponent,
			idParts: ['radio'],
			title: 'Radio mode',
			snippets: [
				this.getSnippet('selectable', 'radio/selectable-example-radio-preview.component.html', 'HTML'),
				this.getSnippet('selectable', 'radio/selectable-example-radio-preview.component.ts', 'TS'),
				this.getSnippet('selectable', 'selectable-example-preview.component.scss', 'SCSS')
			]
		},
		{
			component: SelectableExampleWindowsPreviewComponent,
			idParts: ['windows'],
			title: 'Windows mode',
			snippets: [
				this.getSnippet('selectable', 'windows/selectable-example-windows-preview.component.html', 'HTML'),
				this.getSnippet('selectable', 'windows/selectable-example-windows-preview.component.ts', 'TS'),
				this.getSnippet('selectable', 'selectable-example-preview.component.scss', 'SCSS')
			]
		}
	];
}
