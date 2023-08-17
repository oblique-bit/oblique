import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-slide-toggle-example-second-preview',
	templateUrl: './slide-toggle-example-second-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [MatSlideToggleModule],
	host: {class: 'layout-breakpoint-lg'}
})
export class SlideToggleExampleSecondPreviewComponent implements PreviewComponent {
	toggleValue: 'checked' | 'unchecked' = 'unchecked';

	onToggleChange(): void {
		this.toggleValue = this.toggleValue === 'checked' ? 'unchecked' : 'checked';
	}
}
