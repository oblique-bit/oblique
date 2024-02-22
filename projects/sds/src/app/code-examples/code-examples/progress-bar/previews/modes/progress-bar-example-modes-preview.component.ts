import {Component} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
	selector: 'app-progress-bar-example-modes-preview',
	templateUrl: './progress-bar-example-modes-preview.component.html',
	styleUrls: ['./progress-bar-example-modes-preview.component.scss'],
	standalone: true,
	imports: [MatProgressBarModule]
})
export class ProgressBarExampleModesPreviewComponent {}
