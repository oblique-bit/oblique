import {Component, type OnDestroy, type OnInit, inject} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';

@Component({
	selector: 'sb-column-layout-full-height-sample',
	templateUrl: './column-layout-full-height-sample.component.html',
	standalone: false
})
export class ColumnLayoutFullHeightSampleComponent implements OnInit, OnDestroy {
	left = true;
	right = true;
	noLayout = false;
	wider = false;
	private readonly masterLayoutService = inject(ObMasterLayoutService);

	ngOnInit(): void {
		// Update the value in the next change detection cycle in order to
		// avoid a ExpressionChangedAfterItHasBeenCheckedError.
		// More information: https://angular.dev/errors/NG0100
		setTimeout(() => {
			this.masterLayoutService.layout.hasLayout = false;
			this.masterLayoutService.footer.isSticky = true;
		}, 0);
	}

	ngOnDestroy(): void {
		this.masterLayoutService.layout.hasLayout = true;
		this.masterLayoutService.footer.isSticky = false;
	}
}
