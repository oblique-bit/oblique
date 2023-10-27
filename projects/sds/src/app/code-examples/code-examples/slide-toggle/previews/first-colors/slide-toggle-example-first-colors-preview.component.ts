import {Component} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-slide-toggle-example-first-colors-preview',
	templateUrl: './slide-toggle-example-first-colors-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [MatSlideToggleModule],
	host: {class: 'layout-breakpoint-sm'}
})
export class SlideToggleExampleFirstColorsPreviewComponent {}
