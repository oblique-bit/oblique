import {Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-basic-slider',
	templateUrl: './basic-slider.component.html',
	styleUrl: './basic-slider.component.scss',
	imports: [MatSliderModule]
})
export class BasicSliderComponent {}
