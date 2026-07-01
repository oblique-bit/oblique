import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-slider-options',
	imports: [MatSliderModule],
	templateUrl: './slider-options.component.html',
	styleUrl: './slider-options.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SliderOptionsComponent {}
