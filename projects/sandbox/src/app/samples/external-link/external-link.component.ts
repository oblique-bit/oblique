import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import type {ObEExternalLinkIcon} from '@oblique/oblique';
import type {MatSlideToggleChange} from '@angular/material/slide-toggle';

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
	standalone: false,
	templateUrl: './external-link.component.html',
	styleUrl: './external-link.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ExternalLinkComponent {
	iconPosition: ObEExternalLinkIcon = 'left';
	isExternal: boolean | 'auto' = 'auto';
	readonly dynamicHref = signal('i18n.routes.samples.external-link.mdn');

	iconPositions: IconPosition[] = [
		{value: 'left', viewValue: 'Left'},
		{value: 'right', viewValue: 'Right'},
		{value: 'none', viewValue: 'None'},
	];

	isLinkExternal: IsLinkExternalState[] = [
		{value: 'auto', viewValue: 'Auto'},
		{value: true, viewValue: 'True'},
		{value: false, viewValue: 'False'},
	];

	toggleExternal(event: MatSlideToggleChange): void {
		const translationKey = event.checked
			? 'i18n.routes.samples.external-link.mdn'
			: 'i18n.routes.samples.external-link.localhost';
		this.dynamicHref.set(translationKey);
	}
}
