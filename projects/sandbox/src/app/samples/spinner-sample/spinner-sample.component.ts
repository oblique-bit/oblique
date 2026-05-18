import {Component, inject} from '@angular/core';
import {ObSpinnerService} from '@oblique/oblique';

@Component({
	selector: 'sb-spinner-sample',
	standalone: false,
	templateUrl: './spinner-sample.component.html',
	styleUrl: './spinner-sample.component.scss',
})
export class SpinnerSampleComponent {
	readonly demoChannel = 'demo';
	private readonly window: Window;
	private readonly spinnerService = inject(ObSpinnerService);
	private isSpinnerActive = {
		demo: false,
		default: false,
		nonExistent: false,
	};

	constructor() {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	toggleSpinner(channel = 'default'): void {
		if (this.isSpinnerActive[channel]) {
			this.spinnerService.deactivate(channel);
		} else {
			this.spinnerService.activate(channel);
		}
		if (channel === 'default') {
			this.window.setTimeout(() => {
				this.spinnerService.deactivate(channel);
				this.isSpinnerActive.default = false;
			}, 5000);
		}
		this.isSpinnerActive[channel] = !this.isSpinnerActive[channel];
	}
}
