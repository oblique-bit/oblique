import {ChangeDetectorRef, Component, type OnChanges, type SimpleChange, type SimpleChanges, inject, input} from '@angular/core';

@Component({
	selector: 'app-tab',
	imports: [],
	templateUrl: './tab.component.html',
	styleUrl: './tab.component.scss'
})
export class TabComponent implements OnChanges {
	readonly hidden = input(false);
	readonly initiallyActive = input(true);
	readonly name = input('');

	active = false;

	private readonly cdr = inject(ChangeDetectorRef);

	ngOnChanges(changes: TabChanges): void {
		if (changes.initiallyActive) {
			this.active = this.initiallyActive();
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
