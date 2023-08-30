import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChange, SimpleChanges, inject} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-tab',
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss'],
	standalone: true,
	imports: [CommonModule]
})
export class TabComponent implements OnChanges {
	@Input() initiallyActive = true;
	@Input() name = '';

	active = false;

	private readonly cdr = inject(ChangeDetectorRef);

	ngOnChanges(changes: TabChanges): void {
		if (changes.initiallyActive) {
			this.active = this.initiallyActive;
		}
	}

	updateActive(active: boolean): void {
		this.active = active;
		this.cdr.detectChanges(); // so that the content of the tab is initially loaded when no preview is available
	}
}

interface TabChanges extends SimpleChanges {
	initiallyActive: SimpleChange;
}
