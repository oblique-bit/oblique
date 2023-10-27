import {Component, OnDestroy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ObButtonModule, ObSpinnerModule, ObSpinnerService} from '@oblique/oblique';

@Component({
	selector: 'app-custom-channel-preview',
	templateUrl: './custom-channel-preview.component.html',
	styleUrls: ['./custom-channel-preview.component.scss'],
	standalone: true,
	imports: [ObSpinnerModule, MatButtonModule, ObButtonModule, MatSlideToggleModule]
})
export class CustomChannelPreviewComponent implements OnDestroy {
	readonly channel = 'demoChannel';
	private readonly spinnerService = inject(ObSpinnerService);

	ngOnDestroy(): void {
		// this ensures the spinner is in a clean state when quitting this page
		this.spinnerService.forceDeactivate(this.channel);
	}

	toggleSpinner(event: MatSlideToggleChange): void {
		if (event.checked) {
			this.spinnerService.activate(this.channel);
		} else {
			this.spinnerService.deactivate(this.channel);
		}
	}
}
