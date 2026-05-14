import {Component, inject} from '@angular/core';
import {ObSpinnerService} from '@oblique/oblique';

@Component({
	selector: 'sb-spinner-sample',
	standalone: false,
	templateUrl: './spinner-sample.component.html',
	styleUrl: './spinner-sample.component.scss',
})
export class SpinnerSampleComponent {
	channel = 'demo';
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

	toggleSpinner(): void {
		if (this.isSpinnerActive[this.channel]) {
			this.spinnerService.deactivate(this.channel);
		} else {
			this.spinnerService.activate(this.channel);
		}
		if (this.channel === 'default') {
			this.window.setTimeout(() => {
				this.spinnerService.deactivate(this.channel);
				this.isSpinnerActive.default = false;
			}, 5000);
		}
		this.isSpinnerActive[this.channel] = !this.isSpinnerActive[this.channel];
	}
}
