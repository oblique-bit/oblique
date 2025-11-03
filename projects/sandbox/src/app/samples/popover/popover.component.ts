import {Component} from '@angular/core';
import {ObEToggleType} from '@oblique/oblique';
import type {Placement} from '@popperjs/core';

@Component({
	selector: 'sb-popover',
	standalone: false,
	templateUrl: './popover.component.html',
	styleUrl: './popover.component.scss'
})
export class PopoverComponent {
	param = 'This is a param.';
	placement: Placement = 'top';
	openPopoverPosition = 'center';
	toggleHandle: ObEToggleType;
	closeOnlyOnToggle: boolean;
	appendToBody = false;
	hasScrollBar = false;

	toggleTypeClick = ObEToggleType.CLICK;
	toggleTypeHover = ObEToggleType.HOVER;

	popoverVisible = false;
	lastVisibilityEventTimestamp: Date | null = null;

	setVisibility(visible: boolean): void {
		this.popoverVisible = visible;
		this.lastVisibilityEventTimestamp = new Date();
	}
}
