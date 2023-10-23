import {Component} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
	selector: 'app-progress-bar-example-colors-preview',
	templateUrl: './progress-bar-example-colors-preview.component.html',
	styleUrls: ['./progress-bar-example-colors-preview.component.scss'],
	standalone: true,
	imports: [MatProgressBarModule]
})
export class ProgressBarExampleColorsPreviewComponent {}
