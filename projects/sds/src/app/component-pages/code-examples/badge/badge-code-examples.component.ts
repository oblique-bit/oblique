import {Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {BadgeExampleColorWarnComponent} from './previews/badge-example-color-warn/badge-example-color-warn.component';
import {BadgeExampleDefaultComponent} from './previews/badge-example-default/badge-example-default.component';
import {BadgeExamplePositionBelowBeforeComponent} from './previews/badge-example-position-below-before/badge-example-position-below-before.component';
import {BadgeExampleOverlapFalseComponent} from './previews/badge-example-overlap-false/badge-example-overlap-false.component';

@Component({
	selector: 'app-badge-code-examples',
	templateUrl: '../../code-examples.component.html'
})
export class BadgeCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'badge-examples';

	readonly previews: CodeExample[] = [
		{
			component: BadgeExampleDefaultComponent,
			idParts: ['default'],
			snippets: [this.getSnippet('badge', 'badge-example-default/badge-example-default.component.html', 'HTML')]
		},
		{
			component: BadgeExampleColorWarnComponent,
			idParts: ['color', 'warn'],
			snippets: [this.getSnippet('badge', 'badge-example-color-warn/badge-example-color-warn.component.html', 'HTML')]
		},
		{
			component: BadgeExamplePositionBelowBeforeComponent,
			idParts: ['below', 'before'],
			snippets: [this.getSnippet('badge', 'badge-example-position-below-before/badge-example-position-below-before.component.html', 'HTML')]
		},
		{
			component: BadgeExampleOverlapFalseComponent,
			idParts: ['overlap', 'false'],
			snippets: [this.getSnippet('badge', 'badge-example-overlap-false/badge-example-overlap-false.component.html', 'HTML')]
		}
	];
}
