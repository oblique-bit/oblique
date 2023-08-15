import {Component} from '@angular/core';

@Component({
	selector: 'sb-slide-toggle',
	templateUrl: './slide-toggle.component.html'
})
export class SlideToggleComponent {
	isHintChecked = false;
	isMandatoryChecked = false;

	onHintToggleChange(): void {
		this.isHintChecked = !this.isHintChecked;
	}

	onMandatoryToggleChange(): void {
		this.isMandatoryChecked = !this.isMandatoryChecked;
	}
}
