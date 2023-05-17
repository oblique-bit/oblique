import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';

@Component({
	selector: 'app-tab',
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnChanges {
	@Input() initiallyActive = true;
	@Input() title = '';

	active = false;

	ngOnChanges(changes: TabChanges): void {
		if (changes.initiallyActive) {
			this.active = this.initiallyActive;
		}
	}

	updateActive(active: boolean): void {
		this.active = active;
	}
}

interface TabChanges extends SimpleChanges {
	initiallyActive: SimpleChange;
}
