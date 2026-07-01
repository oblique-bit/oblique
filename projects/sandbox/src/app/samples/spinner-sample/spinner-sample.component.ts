import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ObSpinnerService, WINDOW} from '@oblique/oblique';

@Component({
	selector: 'sb-spinner-sample',
	standalone: false,
	templateUrl: './spinner-sample.component.html',
	styleUrl: './spinner-sample.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SpinnerSampleComponent {
	readonly demoChannel = 'demo';
	private readonly window = inject(WINDOW);
	private readonly spinnerService = inject(ObSpinnerService);
	private isSpinnerActive = {
		demo: false,
		default: false,
		nonExistent: false,
	};

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
