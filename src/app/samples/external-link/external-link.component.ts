import {Component} from '@angular/core';

interface IconPosition {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'sc-external-link',
	templateUrl: './external-link.component.html'
})
export class ExternalLinkComponent {
	iconPosition = 'left';

	iconPositions: IconPosition[] = [
		{value: 'right', viewValue: 'Right'},
		{value: 'left', viewValue: 'Left'},
		{value: 'none', viewValue: 'None'}
	];
}
