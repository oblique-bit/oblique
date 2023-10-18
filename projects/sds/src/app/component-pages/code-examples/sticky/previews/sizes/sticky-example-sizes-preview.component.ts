import {Component} from '@angular/core';
import {ObStickyModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-sticky-example-sizes-preview',
	templateUrl: './sticky-example-sizes-preview.component.html',
	styleUrls: ['../sticky-example.scss'],
	standalone: true,
	imports: [ObStickyModule]
})
export class StickyExampleSizesPreviewComponent implements PreviewComponent {}
