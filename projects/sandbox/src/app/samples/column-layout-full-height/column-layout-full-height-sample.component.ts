import {ChangeDetectionStrategy, Component, type OnDestroy, type OnInit, inject} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';

@Component({
	selector: 'sb-column-layout-full-height-sample',
	standalone: false,
	templateUrl: './column-layout-full-height-sample.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ColumnLayoutFullHeightSampleComponent implements OnInit, OnDestroy {
	left = 'OPENED';
	right = 'OPENED';
	noLayout = false;
	wider = false;
	private readonly masterLayoutService = inject(ObMasterLayoutService);

	private originalHasLayout!: boolean;
	private originalIsStickyFooter!: boolean;
	private originalIsStickyHeader!: boolean;

	ngOnInit(): void {
		// Update the value in the next change detection cycle in order to
		// avoid a ExpressionChangedAfterItHasBeenCheckedError.
		// More information: https://angular.dev/errors/NG0100
		setTimeout(() => {
			this.originalHasLayout = this.masterLayoutService.layout.hasLayout;
			this.originalIsStickyFooter = this.masterLayoutService.footer.isSticky;
			this.originalIsStickyHeader = this.masterLayoutService.header.isSticky;
			this.masterLayoutService.layout.hasLayout = false;
			this.masterLayoutService.footer.isSticky = true;
			this.masterLayoutService.header.isSticky = true;
		}, 0);
	}

	ngOnDestroy(): void {
		this.masterLayoutService.layout.hasLayout = this.originalHasLayout;
		this.masterLayoutService.footer.isSticky = this.originalIsStickyFooter;
		this.masterLayoutService.header.isSticky = this.originalIsStickyHeader;
	}
}
