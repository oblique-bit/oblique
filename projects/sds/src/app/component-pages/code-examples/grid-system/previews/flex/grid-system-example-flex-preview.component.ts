import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-grid-system-example-flex-preview',
	templateUrl: './grid-system-example-flex-preview.component.html',
	styleUrls: ['../grid-system.scss'],
	standalone: true
})
export class GridSystemExampleFlexPreviewComponent implements PreviewComponent {}
