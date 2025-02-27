import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-popover12-example-default-preview',
	templateUrl: './popover12-example-events-preview.component.html',
	imports: [CommonModule, ObPopoverModule, ObButtonModule, MatButtonModule],
	styleUrls: ['./popover12-example-events-preview.component.scss']
})
export class Popover12ExampleEventsPreviewComponent {
	popoverVisible = false;
	lastVisibilityEventTimestamp: Date | null = null;

	setVisibility(visible: boolean): void {
		this.popoverVisible = visible;
		this.lastVisibilityEventTimestamp = new Date();
	}
}
