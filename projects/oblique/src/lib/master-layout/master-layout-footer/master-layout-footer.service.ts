import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutFooterService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly events = new Subject<ObIMasterLayoutEvent>();
	private isCustomInternal = this.config.footer.isCustom;
	private isStickyInternal = this.config.footer.isSticky;
	private hasLogoOnScrollInternal = this.config.footer.hasLogoOnScroll;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this.events.asObservable();
	}

	get isCustom(): boolean {
		return this.isCustomInternal;
	}

	set isCustom(value: boolean) {
		this.isCustomInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM,
			value
		});
	}

	get isSticky(): boolean {
		return this.isStickyInternal;
	}

	set isSticky(value: boolean) {
		this.isStickyInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.FOOTER_IS_STICKY,
			value
		});
	}

	/**
	 *  @deprecated since Oblique 12. It will be removed with Oblique 13. In an effort to reduce the size of the header and the footer, the logo will not be displayed in the footer anymore and it will be possible to use the logo without the text.
	 */
	get hasLogoOnScroll(): boolean {
		return this.hasLogoOnScrollInternal;
	}

	/**
	 *  @deprecated since Oblique 12. It will be removed with Oblique 13. In an effort to reduce the size of the header and the footer, the logo will not be displayed in the footer anymore and it will be possible to use the logo without the text.
	 */
	set hasLogoOnScroll(value: boolean) {
		this.hasLogoOnScrollInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.FOOTER_HAS_LOGO_ON_SCROLL,
			value
		});
	}
}
