import {Directive, ElementRef, HostBinding, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MasterLayoutFooterService} from './master-layout-footer.service';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';

/**
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Directive({
	selector: '[orMasterLayoutFooter]',
	exportAs: 'orMasterLayoutFooter'
})
export class MasterLayoutFooterDirective extends Unsubscribable {

	@HostBinding('class.application-footer-sm')
	public footerSM = false;

	constructor(private readonly footerService: MasterLayoutFooterService,
				private readonly elementRef: ElementRef,
				@Inject(DOCUMENT) private readonly document: any) {
		super();
		console.warn('MasterLayoutFooterDirective is deprecated since version 2.1.0 and will be deleted in version 3.0.0. ' +
			'Use MasterLayoutComponent & MasterLayoutService instead');

		this.footerService.small = this.elementRef.nativeElement.classList.contains('application-footer-sm');

		this.footerService.variantChange
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((footerSM) => {
				this.footerSM = footerSM;
			});
	}
}
