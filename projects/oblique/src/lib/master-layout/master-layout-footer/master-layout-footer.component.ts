import {Component, ContentChildren, HostBinding, OnDestroy, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

@Component({
	selector: 'ob-master-layout-footer',
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-footer'}
})
export class ObMasterLayoutFooterComponent implements OnDestroy {
	home = this.config.homePageRoute;
	isCustom = this.config.footer.isCustom;
	@ContentChildren('obFooterLink') readonly templates: QueryList<TemplateRef<any>>;
	@HostBinding('class.ob-logo-on-scroll') hasLogoOnScroll = this.config.footer.hasLogoOnScroll;
	private readonly unsubscribe = new Subject();

	constructor(private readonly masterLayout: ObMasterLayoutService, private readonly config: ObMasterLayoutConfig) {
		this.customChange();
		this.hasLogoChange();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private customChange(): void {
		this.masterLayout.footer.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isCustom = event.value));
	}

	private hasLogoChange(): void {
		this.masterLayout.footer.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.FOOTER_HAS_LOGO_ON_SCROLL),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.hasLogoOnScroll = event.value));
	}
}
