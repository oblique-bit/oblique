import {Component} from '@angular/core';
import {ObStickyModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-sticky-example-default-preview',
	templateUrl: './sticky-example-default-preview.component.html',
	styleUrls: ['../sticky-example.scss'],
	standalone: true,
	imports: [ObStickyModule]
})
export class StickyExampleDefaultPreviewComponent implements PreviewComponent {}
