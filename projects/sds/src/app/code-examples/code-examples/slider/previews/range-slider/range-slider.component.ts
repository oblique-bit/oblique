import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-range-slider',
	imports: [MatSliderModule],
	templateUrl: './range-slider.component.html',
	styleUrl: './range-slider.component.scss'
})
export class RangeSliderComponent {}
