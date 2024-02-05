import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CollapseExampleDefaultPreviewComponent} from './previews/default/collapse-example-default-preview.component';
import {CollapseExampleStatePreviewComponent} from './previews/state/collapse-example-state-preview.component';
import {CollapseExampleIconPositionPreviewComponent} from './previews/icon-position/collapse-example-icon-position-preview.component';
import {CollapseExampleAnimationDurationPreviewComponent} from './previews/animation-duration/collapse-example-animation-duration-preview.component';

@Component({
	selector: 'app-code-example-collapse',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class CollapseCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'collapse-examples';
	readonly previews: CodeExample[] = [
		{
			component: CollapseExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('collapse', 'default/collapse-example-default-preview.component.html', 'HTML'),
				this.getSnippet('collapse', 'default/collapse-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: CollapseExampleAnimationDurationPreviewComponent,
			idParts: ['animation', 'duration'],
			title: 'Animation Duration',
			snippets: [
				this.getSnippet('collapse', 'animation-duration/collapse-example-animation-duration-preview.component.html', 'HTML'),
				this.getSnippet('collapse', 'animation-duration/collapse-example-animation-duration-preview.component.ts', 'TS')
			]
		},
		{
			component: CollapseExampleIconPositionPreviewComponent,
			idParts: ['icon', 'position'],
			title: 'Icon Position',
			snippets: [
				this.getSnippet('collapse', 'icon-position/collapse-example-icon-position-preview.component.html', 'HTML'),
				this.getSnippet('collapse', 'icon-position/collapse-example-icon-position-preview.component.ts', 'TS')
			]
		},
		{
			component: CollapseExampleStatePreviewComponent,
			idParts: ['state'],
			title: 'State',
			snippets: [
				this.getSnippet('collapse', 'state/collapse-example-state-preview.component.html', 'HTML'),
				this.getSnippet('collapse', 'state/collapse-example-state-preview.component.ts', 'TS')
			]
		}
	];
}
