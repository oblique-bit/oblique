import {Component, OnInit} from '@angular/core';
import {ObMasterLayoutService, ObSpinnerService} from '@oblique/oblique';

@Component({
	selector: 'ob-spinner-sample',
	templateUrl: './spinner-sample.component.html',
	styleUrls: ['./spinner-sample.component.scss']
})
export class ObSpinnerSampleComponent implements OnInit {
	spinnerVisible = false;
	channel: string = 'demo';
	private readonly window: Window;

	constructor(private readonly masterLayoutService: ObMasterLayoutService, private readonly spinnerService: ObSpinnerService) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	ngOnInit(): void {
		//this.masterLayoutService.layout.isFixed = true;
	}

	setMasterLayout($event): void {
		this.masterLayoutService.layout.isFixed = $event.value;
	}

	toggleSpinner() {
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
