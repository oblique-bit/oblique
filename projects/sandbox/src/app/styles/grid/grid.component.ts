import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-grid',
	standalone: false,
	templateUrl: './grid.component.html',
	styleUrl: './grid.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class GridComponent {}
