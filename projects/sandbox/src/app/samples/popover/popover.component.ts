import {Component} from '@angular/core';
import {ObEToggleType} from '@oblique/oblique';
import {Placement} from '@popperjs/core';

@Component({
	selector: 'sb-popover',
	templateUrl: './popover.component.html',
	styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {
	param = 'This is a param.';
	placement: Placement = 'top';
	openPopoverPosition = 'center';
	toggleHandle: ObEToggleType;
	closeOnlyOnToggle: boolean;
	appendToBody = false;

	toggleTypeClick = ObEToggleType.CLICK;
	toggleTypeHover = ObEToggleType.HOVER;
}
