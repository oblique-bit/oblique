import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-public-scss-variables-and-mixins-example-palette-preview',
	templateUrl: './public-scss-variables-and-mixins-example-palette-preview.component.html',
	styleUrls: [
		'../../../../code-example-flex-layout.scss',
		'../public-scss-variables-and-mixins-example-preview.component.scss',
		'./public-scss-variables-and-mixins-example-palette-preview.component.scss'
	],

	standalone: true
})
export class PublicScssVariablesAndMixinsExamplePalettePreviewComponent implements PreviewComponent {}