import {Component} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-slide-toggle-example-first-colors-preview',
	imports: [MatSlideToggleModule],
	templateUrl: './slide-toggle-example-first-colors-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	host: {class: 'layout-breakpoint-sm'},
})
export class SlideToggleExampleFirstColorsPreviewComponent {}
