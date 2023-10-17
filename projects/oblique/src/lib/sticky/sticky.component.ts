import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ContentChild,
	HostBinding,
	Input,
	OnChanges,
	TemplateRef,
	ViewEncapsulation,
	inject
} from '@angular/core';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';

/**
 * @deprecated since version 11.0.0. It will be removed with Oblique 12. CSS flexbox and / or position: sticky should be used instead.
 */
@Component({
	selector: 'ob-sticky',
	exportAs: 'obSticky',
	templateUrl: './sticky.component.html',
	styleUrls: ['./sticky.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-sticky'},
	standalone: true,
	imports: [NgIf, NgTemplateOutlet, NgClass, CdkScrollable]
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
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	ngAfterViewInit(): void {
		this.window.setTimeout(() => this.manageSizes()); // so that initial values are taken into account
	}

	ngOnChanges(): void {
		this.manageSizes();
	}

	private static validateSize(size: string): void {
		if (size && !ObStickyComponent.SIZES.includes(size)) {
			throw new Error(`"${size}" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.`);
		}
	}

	private manageSizes(): void {
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
		this.changeDetectorRef.detectChanges();
	}

	private setMainStickySize(size: string): void {
		this.isMainStickyLarge = size === 'lg';
		this.isMainStickySmall = size === 'sm';
	}
}
