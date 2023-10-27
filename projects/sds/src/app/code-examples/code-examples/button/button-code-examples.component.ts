import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {ButtonExampleColorsComponent} from './previews/colors/button-example-colors.component';
import {ButtonExampleOtherOptionsComponent} from './previews/other-options/button-example-other-options.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CodeExampleComponent, IdPipe, CommonModule]
})
export class ButtonCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'button-examples';
	readonly previews: CodeExample[] = [
		{
			component: ButtonExampleColorsComponent,
			idParts: ['colors'],
			title: 'Colors',
			snippets: [
				this.getSnippet('button', 'colors/button-example-colors.component.html', 'HTML'),
				this.getSnippet('button', 'colors/button-example-colors.component.ts', 'TS')
			]
		},
		{
			component: ButtonExampleOtherOptionsComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('button', 'other-options/button-example-other-options.component.html', 'HTML'),
				this.getSnippet('button', 'other-options/button-example-other-options.component.ts', 'TS')
			]
		}
	];
}
