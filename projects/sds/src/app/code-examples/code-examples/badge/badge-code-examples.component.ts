import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {BadgeExampleColorsComponent} from './previews/colors/badge-example-colors.component';
import {BadgeExampleOtherOptionsComponent} from './previews/other-options/badge-example-other-options.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-badge-code-examples',
	imports: [CommonModule, CodeExampleComponent, IdPipe],
	templateUrl: '../../code-examples.component.html',
})
export class BadgeCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'badge-examples';

	readonly previews: CodeExample[] = [
		{
			component: BadgeExampleColorsComponent,
			idParts: ['colors'],
			title: 'Colors',
			snippets: [
				this.getSnippet('badge', 'colors/badge-example-colors.component.html', 'HTML'),
				this.getSnippet('badge', 'colors/badge-example-colors.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout'),
			],
		},
		{
			component: BadgeExampleOtherOptionsComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('badge', 'other-options/badge-example-other-options.component.html', 'HTML'),
				this.getSnippet('badge', 'other-options/badge-example-other-options.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout'),
			],
		},
	];
}
