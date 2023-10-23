import {Component} from '@angular/core';
import {ObStickyModule} from '@oblique/oblique';

@Component({
	selector: 'app-sticky-example-default-preview',
	templateUrl: './sticky-example-default-preview.component.html',
	styleUrls: ['../sticky-example.scss'],
	standalone: true,
	imports: [ObStickyModule]
})
export class StickyExampleDefaultPreviewComponent {}
