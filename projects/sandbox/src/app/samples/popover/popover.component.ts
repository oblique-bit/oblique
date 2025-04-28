import {Component} from '@angular/core';
import {ObEToggleType} from '@oblique/oblique';
import {Placement} from '@popperjs/core';

@Component({
	selector: 'sb-popover',
	templateUrl: './popover.component.html',
	styleUrl: './popover.component.scss',
	standalone: false
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
