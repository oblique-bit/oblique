import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
	selector: 'app-progress-bar-example-colors-preview',
	imports: [MatProgressBarModule],
	templateUrl: './progress-bar-example-colors-preview.component.html',
	styleUrl: './progress-bar-example-colors-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProgressBarExampleColorsPreviewComponent {}
