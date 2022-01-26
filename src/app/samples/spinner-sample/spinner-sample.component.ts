import {Component} from '@angular/core';
import {ObSpinnerService} from '@oblique/oblique';

@Component({
	selector: 'sc-spinner-sample',
	templateUrl: './spinner-sample.component.html',
	styleUrls: ['./spinner-sample.component.scss']
})
export class SpinnerSampleComponent {
	spinnerVisible = false;
	channel = 'demo';
	private readonly window: Window;

	constructor(private readonly spinnerService: ObSpinnerService) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	toggleSpinner(): void {
		switch (this.spinnerVisible) {
			case false:
				this.spinnerService.activate(this.channel);
				break;
			case true:
				this.spinnerService.deactivate(this.channel);
				break;
		}
		if (this.channel === 'default') {
			this.window.setTimeout(() => this.spinnerService.deactivate(this.channel), 5000);
		}
		this.spinnerVisible = !this.spinnerVisible;
	}
}
