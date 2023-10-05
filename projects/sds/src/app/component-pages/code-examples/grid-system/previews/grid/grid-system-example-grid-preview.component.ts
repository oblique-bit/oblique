import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-grid-system-example-grid-preview',
	templateUrl: './grid-system-example-grid-preview.component.html',
	styleUrls: ['../grid-system.scss'],
	standalone: true
})
export class GridSystemExampleGridPreviewComponent implements PreviewComponent {}
