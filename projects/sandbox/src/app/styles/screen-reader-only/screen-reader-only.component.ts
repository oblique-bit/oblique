import {Component, OnInit, inject} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {ObMasterLayoutService} from '@oblique/oblique';

@Component({
	selector: 'sb-screen-reader-only',
	templateUrl: './screen-reader-only.component.html',
	styleUrl: './screen-reader-only.component.scss',
	standalone: false
})
export class ScreenReaderOnlyComponent implements OnInit {
	layout: UntypedFormControl;
	private readonly masterLayout = inject(ObMasterLayoutService);

	ngOnInit(): void {
		this.layout = new UntypedFormControl(this.computeValue(this.masterLayout.header.isSticky, this.masterLayout.footer.isSticky));
		this.layout.valueChanges.subscribe(value => {
			this.masterLayout.header.isSticky = ['fixed', 'stickyHeader'].includes(value);
			this.masterLayout.footer.isSticky = ['fixed', 'stickyFooter'].includes(value);
		});
	}

	private computeValue(isHeaderSticky: boolean, isFooterSticky: boolean): string {
		if (isFooterSticky && isHeaderSticky) {
			return 'fixed';
		} else if (isFooterSticky) {
			return 'stickyFooter';
		} else if (isHeaderSticky) {
			return 'stickyHeader';
		}
		return 'continuous';
	}
}
