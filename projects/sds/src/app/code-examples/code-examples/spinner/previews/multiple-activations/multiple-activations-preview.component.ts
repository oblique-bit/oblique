import {Component, type OnDestroy, inject} from '@angular/core';
import {ObButtonModule, ObSpinnerModule, ObSpinnerService} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-multiple-activations-preview',
	templateUrl: './multiple-activations-preview.component.html',
	styleUrl: './multiple-activations-preview.component.scss',
	imports: [ObSpinnerModule, ObButtonModule, MatButtonModule]
})
export class MultipleActivationsPreviewComponent implements OnDestroy {
	counter = 0;
	readonly channel = 'demoChannelMultipleActivations';
	private readonly spinnerService = inject(ObSpinnerService);

	ngOnDestroy(): void {
		// this ensures the spinner is in a clean state when quitting this page
		this.forceDeactivateSpinner();
	}

	activateSpinner(): void {
		this.spinnerService.activate(this.channel);
		this.counter++;
	}

	deactivateSpinner(): void {
		this.spinnerService.deactivate(this.channel);
		this.counter = Math.max(0, this.counter - 1);
	}

	forceDeactivateSpinner(): void {
		this.spinnerService.forceDeactivate(this.channel);
		this.counter = 0;
	}
}
