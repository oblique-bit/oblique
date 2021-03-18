import {AfterViewInit, Component, ContentChild, HostBinding, Input, OnChanges, TemplateRef, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-sticky',
	exportAs: 'obSticky',
	templateUrl: 'sticky.component.html',
	styleUrls: ['./sticky.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-sticky'}
})
export class ObStickyComponent implements OnChanges, AfterViewInit {
	@ContentChild('obStickyHeader') readonly stickyHeaderTemplate: TemplateRef<any>;
	@ContentChild('obStickyMain') readonly stickyMainTemplate: TemplateRef<any>;
	@ContentChild('obStickyFooter') readonly stickyFooterTemplate: TemplateRef<any>;
	@Input() headerSize: string;
	@Input() footerSize: string;
	@Input() @HostBinding('class.ob-no-layout') noLayout = false;
	@HostBinding('class.ob-sticky-lg') isMainStickyLarge = false;
	@HostBinding('class.ob-sticky-sm') isMainStickySmall = false;
	nestedStickySize: string;

	private static readonly SIZES = ['sm', 'md', 'lg'];
	private readonly window: Window;

	constructor() {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	ngAfterViewInit() {
		this.window.setTimeout(() => this.ngOnChanges()); // so that initial values are taken into account
	}

	ngOnChanges(): void {
		ObStickyComponent.validateSize(this.headerSize);
		ObStickyComponent.validateSize(this.footerSize);

		if (this.stickyHeaderTemplate) {
			this.setMainStickySize(this.headerSize);
			if (this.stickyFooterTemplate) {
				this.nestedStickySize = `ob-sticky-${this.footerSize}`;
			}
		} else if (this.stickyFooterTemplate) {
			this.setMainStickySize(this.footerSize);
		}
	}

	private static validateSize(size: string): void {
		if (size && ObStickyComponent.SIZES.indexOf(size) === -1) {
			throw new Error(`"${size}" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.`);
		}
	}

	private setMainStickySize(size: string): void {
		this.isMainStickyLarge = size === 'lg';
		this.isMainStickySmall = size === 'sm';
	}
}
