import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-basic-slider',
	templateUrl: './basic-slider.component.html',
	styleUrls: ['./basic-slider.component.scss'],
	standalone: true,
	imports: [MatSliderModule]
})
export class BasicSliderComponent {}
