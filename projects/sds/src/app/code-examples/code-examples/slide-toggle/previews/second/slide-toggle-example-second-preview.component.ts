import {Component} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-slide-toggle-example-second-preview',
	imports: [MatSlideToggleModule],
	templateUrl: './slide-toggle-example-second-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	host: {class: 'layout-breakpoint-lg'}
})
export class SlideToggleExampleSecondPreviewComponent {
	toggleValue: 'checked' | 'unchecked' = 'unchecked';

	onToggleChange(): void {
		this.toggleValue = this.toggleValue === 'checked' ? 'unchecked' : 'checked';
	}
}
