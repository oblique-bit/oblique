import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-typography',
	standalone: false,
	templateUrl: './typography.component.html',
	styleUrl: './typography.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TypographyComponent {}
