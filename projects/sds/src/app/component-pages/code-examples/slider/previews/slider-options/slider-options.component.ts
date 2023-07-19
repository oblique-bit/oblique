import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-slider-options',
	templateUrl: './slider-options.component.html',
	styleUrls: ['./slider-options.component.scss'],
	standalone: true,
	imports: [MatSliderModule]
})
export class SliderOptionsComponent {}
