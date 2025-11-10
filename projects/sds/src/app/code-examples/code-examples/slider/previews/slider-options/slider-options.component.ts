import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-slider-options',
	imports: [MatSliderModule],
	templateUrl: './slider-options.component.html',
	styleUrl: './slider-options.component.scss',
})
export class SliderOptionsComponent {}
