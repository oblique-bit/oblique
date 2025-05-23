import {Component} from '@angular/core';
import type {ObEExternalLinkIcon} from '@oblique/oblique';

interface IconPosition {
	value: string;
	viewValue: string;
}

interface IsLinkExternalState {
	value: boolean | 'auto';
	viewValue: string;
}

@Component({
	selector: 'sb-external-link',
	templateUrl: './external-link.component.html',
	styleUrl: './external-link.component.scss',
	standalone: false
})
export class ExternalLinkComponent {
	iconPosition: ObEExternalLinkIcon = 'left';
	isExternal: boolean | 'auto' = 'auto';

	iconPositions: IconPosition[] = [
		{value: 'left', viewValue: 'Left'},
		{value: 'right', viewValue: 'Right'},
		{value: 'none', viewValue: 'None'}
	];

	isLinkExternal: IsLinkExternalState[] = [
		{value: 'auto', viewValue: 'Auto'},
		{value: true, viewValue: 'True'},
		{value: false, viewValue: 'False'}
	];
}
