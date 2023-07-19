import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {BasicSliderComponent} from './previews/basic-slider/basic-slider.component';
import {RangeSliderComponent} from './previews/range-slider/range-slider.component';
import {SliderOptionsComponent} from './previews/slider-options/slider-options.component';

@Component({
	selector: 'app-slider-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'slider-examples';
	readonly previews: CodeExample[] = [
		{
			component: BasicSliderComponent,
			idParts: ['basic'],
			title: 'Basic slider',
			snippets: [
				this.getSnippet('slider', 'basic-slider/basic-slider.component.html', 'HTML'),
				this.getSnippet('slider', 'basic-slider/basic-slider.component.scss', 'SCSS')
			]
		},
		{
			component: SliderOptionsComponent,
			idParts: ['range'],
			title: 'Slider with thumb label & ticks marks',
			snippets: [
				this.getSnippet('slider', 'slider-options/slider-options.component.html', 'HTML'),
				this.getSnippet('slider', 'slider-options/slider-options.component.scss', 'SCSS')
			]
		},
		{
			component: RangeSliderComponent,
			idParts: ['range'],
			title: 'Range slider',
			snippets: [
				this.getSnippet('slider', 'range-slider/range-slider.component.html', 'HTML'),
				this.getSnippet('slider', 'range-slider/range-slider.component.scss', 'SCSS')
			]
		}
	];
}
