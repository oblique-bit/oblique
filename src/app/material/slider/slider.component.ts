import {Component} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
	selector: 'or-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
	value = 20;
	min = 0;
	max = 100;
	step = 1;
	tickInterval = 0;

	disabled = false;
	invert = false;
	vertical = false;
	thumbLabel = false;

	colors: ThemePalette[] = [];
	color: ThemePalette;

	private readonly PRIMARY_COLOR: ThemePalette = 'primary';
	private readonly ACCENT_COLOR: ThemePalette = 'accent';
	private readonly WARN_COLOR: ThemePalette = 'warn';

	constructor() {
		this.colors = [this.PRIMARY_COLOR, this.ACCENT_COLOR, this.WARN_COLOR];
		this.color = this.colors[0];
	}

	toggleDisabled(): void {
		this.disabled = !this.disabled;
	}

	toggleVertical(): void {
		this.vertical = !this.vertical;
	}

	toggleThumbLabel(): void {
		this.thumbLabel = !this.thumbLabel;
	}

	toggleInverted(): void {
		this.invert = !this.invert;
	}
}
