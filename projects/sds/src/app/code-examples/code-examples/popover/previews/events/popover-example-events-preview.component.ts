import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-popover-example-default-preview',
	templateUrl: './popover-example-events-preview.component.html',
	standalone: true,
	imports: [CommonModule, ObPopoverModule, ObButtonModule, MatButtonModule],
	styleUrls: ['./popover-example-events-preview.component.scss']
})
export class PopoverExampleEventsPreviewComponent {
	popoverVisible = false;
	lastVisibilityEventTimestamp: Date | null = null;

	setVisibility(visible: boolean): void {
		this.popoverVisible = visible;
		this.lastVisibilityEventTimestamp = new Date();
	}
}
