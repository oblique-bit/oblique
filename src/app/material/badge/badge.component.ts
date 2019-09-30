import {Component} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatBadgePosition} from '@angular/material/badge';

@Component({
	selector: 'or-badge',
	templateUrl: './badge.component.html',
	styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
	colors: ThemePalette[] = [];
	color: ThemePalette;
	positions: MatBadgePosition[] = [];
	position: MatBadgePosition;
	badgeContent = '4';

	private readonly PRIMARY_COLOR: ThemePalette = 'primary';
	private readonly ACCENT_COLOR: ThemePalette = 'accent';
	private readonly WARN_COLOR: ThemePalette = 'warn';

	private readonly POSITION_ABOVE_AFTER: MatBadgePosition = 'above after';
	private readonly POSITION_ABOVE_BEFORE: MatBadgePosition = 'above before';
	private readonly POSITION_BELOW_AFTER: MatBadgePosition = 'below after';
	private readonly POSITION_BELOW_BEFORE: MatBadgePosition = 'below before';

	constructor() {
		this.colors = [this.PRIMARY_COLOR, this.ACCENT_COLOR, this.WARN_COLOR];
		this.color = this.colors[0];
		this.positions = [this.POSITION_ABOVE_AFTER, this.POSITION_ABOVE_BEFORE, this.POSITION_BELOW_AFTER, this.POSITION_BELOW_BEFORE];
		this.position = this.positions[0];
	}
}
