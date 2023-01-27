import {Component} from '@angular/core';
import {ObEExternalLinkIcon} from '@oblique/oblique';

interface IconPosition {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'sc-external-link',
	templateUrl: './external-link.component.html',
	styleUrls: ['./external-link.component.scss']
})
export class ExternalLinkComponent {
	iconPosition: ObEExternalLinkIcon = 'left';

	iconPositions: IconPosition[] = [
		{value: 'left', viewValue: 'Left'},
		{value: 'right', viewValue: 'Right'},
		{value: 'none', viewValue: 'None'}
	];
}
