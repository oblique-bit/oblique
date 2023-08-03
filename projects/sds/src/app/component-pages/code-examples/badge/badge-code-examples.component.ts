import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {BadgeExampleColorWarnComponent} from './previews/badge-example-color-warn/badge-example-color-warn.component';
import {BadgeExampleDefaultComponent} from './previews/badge-example-default/badge-example-default.component';
import {BadgeExamplePositionBelowBeforeComponent} from './previews/badge-example-position-below-before/badge-example-position-below-before.component';
import {BadgeExampleOverlapFalseComponent} from './previews/badge-example-overlap-false/badge-example-overlap-false.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-badge-code-examples',
	templateUrl: '../../code-examples.component.html',
	standalone: true,
	imports: [CommonModule, CodeExampleComponent, IdPipe]
})
export class BadgeCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'badge-examples';

	readonly previews: CodeExample[] = [
		{
			component: BadgeExampleDefaultComponent,
			idParts: ['default'],
			title: 'Default badge',
			snippets: [
				this.getSnippet('badge', 'badge-example-default/badge-example-default.component.html', 'HTML'),
				this.getSnippet('badge', 'badge-example-default/badge-example-default.component.ts', 'TS')
			]
		},
		{
			component: BadgeExampleColorWarnComponent,
			idParts: ['color', 'warn'],
			title: 'Warning badge',
			snippets: [
				this.getSnippet('badge', 'badge-example-color-warn/badge-example-color-warn.component.html', 'HTML'),
				this.getSnippet('badge', 'badge-example-color-warn/badge-example-color-warn.component.ts', 'TS')
			]
		},
		{
			component: BadgeExamplePositionBelowBeforeComponent,
			idParts: ['below', 'before'],
			title: 'Positioned badge',
			snippets: [
				this.getSnippet('badge', 'badge-example-position-below-before/badge-example-position-below-before.component.html', 'HTML'),
				this.getSnippet('badge', 'badge-example-position-below-before/badge-example-position-below-before.component.ts', 'TS')
			]
		},
		{
			component: BadgeExampleOverlapFalseComponent,
			idParts: ['overlap', 'false'],
			title: 'Badge without overlap',
			snippets: [
				this.getSnippet('badge', 'badge-example-overlap-false/badge-example-overlap-false.component.html', 'HTML'),
				this.getSnippet('badge', 'badge-example-overlap-false/badge-example-overlap-false.component.ts', 'TS')
			]
		}
	];
}
