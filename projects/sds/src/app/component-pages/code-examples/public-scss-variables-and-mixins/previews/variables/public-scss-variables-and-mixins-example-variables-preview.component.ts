import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-public-scss-variables-and-mixins-example-variables-preview',
	templateUrl: './public-scss-variables-and-mixins-example-variables-preview.component.html',
	styleUrls: [
		'../../../../code-example-flex-layout.scss',
		'../public-scss-variables-and-mixins-example-preview.component.scss',
		'./public-scss-variables-and-mixins-example-variables-preview.component.scss'
	],
	standalone: true
})
export class PublicScssVariablesAndMixinsExampleVariablesPreviewComponent implements PreviewComponent {}
