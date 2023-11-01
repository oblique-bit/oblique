import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {BannerExampleDefaultPreviewComponent} from './previews/default/banner-example-default-preview.component';

@Component({
	selector: 'app-code-example-banner',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class BannerCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'banner-examples';
	readonly previews: CodeExample[] = [
		{
			component: BannerExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Link to Stackblitz Example',
			snippets: []
		}
	];
}
