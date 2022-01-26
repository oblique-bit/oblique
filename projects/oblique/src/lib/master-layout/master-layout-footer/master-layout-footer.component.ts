import {Component, ContentChildren, HostBinding, OnDestroy, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues} from '../master-layout.model';

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
		this.propertyChanges();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private propertyChanges(): void {
		this.masterLayout.footer.configEvents$.pipe(takeUntil(this.unsubscribe)).subscribe(event => {
			switch (event.name) {
				case ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM:
					this.isCustom = event.value;
					break;
				case ObEMasterLayoutEventValues.FOOTER_HAS_LOGO_ON_SCROLL:
					this.hasLogoOnScroll = event.value;
					break;
			}
		});
	}
}
