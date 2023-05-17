import {Component} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
	selector: 'sb-progress-bar',
	templateUrl: './progress-bar.component.html',
	styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
	color: ThemePalette;
	value = 50;
	bufferValue = 80;
	colors: ThemePalette[];

	private readonly PRIMARY_COLOR: ThemePalette = 'primary';
	private readonly ACCENT_COLOR: ThemePalette = 'accent';
	private readonly WARN_COLOR: ThemePalette = 'warn';

	constructor() {
		this.colors = [this.PRIMARY_COLOR, this.ACCENT_COLOR, this.WARN_COLOR];
		this.color = this.colors[0];
	}
}
