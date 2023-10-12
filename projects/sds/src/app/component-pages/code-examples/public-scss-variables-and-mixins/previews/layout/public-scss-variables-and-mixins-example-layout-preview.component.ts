import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-public-scss-variables-and-mixins-example-layout-preview',
	templateUrl: './public-scss-variables-and-mixins-example-layout-preview.component.html',
	styleUrls: [
		'../../../../code-example-flex-layout.scss',
		'../public-scss-variables-and-mixins-example-preview.component.scss',
		'./public-scss-variables-and-mixins-example-layout-preview.component.scss'
	],
	standalone: true
})
export class PublicScssVariablesAndMixinsExampleLayoutPreviewComponent implements PreviewComponent {}
