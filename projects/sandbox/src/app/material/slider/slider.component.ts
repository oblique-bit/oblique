import {Component} from '@angular/core';
import type {ThemePalette} from '@angular/material/core';

@Component({
	selector: 'sb-slider',
	templateUrl: './slider.component.html',
	styleUrl: './slider.component.scss',
	standalone: false
})
export class SliderComponent {
	value = 20;
	min = 0;
	max = 100;
	step = 1;

	disabled = false;
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

	toggleThumbLabel(): void {
		this.thumbLabel = !this.thumbLabel;
	}
}
