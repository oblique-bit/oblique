import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-slide-toggle-example-first-colors-preview',
	templateUrl: './slide-toggle-example-first-colors-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [MatSlideToggleModule],
	host: {class: 'layout-breakpoint-sm'}
})
export class SlideToggleExampleFirstColorsPreviewComponent implements PreviewComponent {}
