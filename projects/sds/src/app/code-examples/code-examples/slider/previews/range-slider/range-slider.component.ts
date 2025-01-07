import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-range-slider',
	templateUrl: './range-slider.component.html',
	styleUrls: ['./range-slider.component.scss'],
	imports: [MatSliderModule]
})
export class RangeSliderComponent {}
