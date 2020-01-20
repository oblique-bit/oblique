import {AfterViewInit, Component, ContentChild, HostBinding, Input, OnChanges, TemplateRef, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'or-sticky',
	exportAs: 'orSticky',
	templateUrl: 'sticky.component.html',
	styleUrls: ['./sticky.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'sticky'}
})
export class StickyComponent implements OnChanges, AfterViewInit {
	@ContentChild('orStickyHeader') readonly stickyHeaderTemplate: TemplateRef<any>;
	@ContentChild('orStickyMain') readonly stickyMainTemplate: TemplateRef<any>;
	@ContentChild('orStickyFooter') readonly stickyFooterTemplate: TemplateRef<any>;
	@Input() headerSize: string;
	@Input() footerSize: string;
	@HostBinding('class.sticky-lg') isMainStickyLarge = false;
	@HostBinding('class.sticky-sm') isMainStickySmall = false;
	nestedStickySize: string;

	private static readonly SIZES = ['sm', 'md', 'lg'];

	ngAfterViewInit() {
		setTimeout(() => this.ngOnChanges());	// so that initial values are taken into account
	}

	ngOnChanges(): void {
		StickyComponent.validateSize(this.headerSize);
		StickyComponent.validateSize(this.footerSize);

		if (this.stickyHeaderTemplate) {
			this.setMainStickySize(this.headerSize);
			if (this.stickyFooterTemplate) {
				this.nestedStickySize = 'sticky-' + this.footerSize;
			}
		} else if (this.stickyFooterTemplate) {
			this.setMainStickySize(this.footerSize);
		}
	}

	private static validateSize(size: string): void {
		if (size && StickyComponent.SIZES.indexOf(size) === -1) {
			throw new Error(`"${size}" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.`);
		}
	}

	private setMainStickySize(size: string): void {
		this.isMainStickyLarge = size === 'lg';
		this.isMainStickySmall = size === 'sm';
	}
}
