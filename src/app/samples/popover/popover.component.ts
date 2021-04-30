import {Component} from '@angular/core';
import {Placement} from '@popperjs/core';

@Component({
	selector: 'ob-popover',
	templateUrl: './popover.component.html',
	styleUrls: ['./popover.component.scss']
})
export class ObPopoverComponent {
	param = 'This is a param.';
	placement: Placement = 'top';
	openPopoverPosition = 'center';
}
