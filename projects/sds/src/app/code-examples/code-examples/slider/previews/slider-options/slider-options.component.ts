import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-slider-options',
	templateUrl: './slider-options.component.html',
	styleUrl: './slider-options.component.scss',
	imports: [MatSliderModule]
})
export class SliderOptionsComponent {}
