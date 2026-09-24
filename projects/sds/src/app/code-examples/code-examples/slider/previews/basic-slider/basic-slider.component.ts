import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
	selector: 'app-basic-slider',
	imports: [MatSliderModule],
	templateUrl: './basic-slider.component.html',
	styleUrl: './basic-slider.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class BasicSliderComponent {}
