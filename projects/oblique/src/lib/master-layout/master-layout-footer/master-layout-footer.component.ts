import {Component, ContentChildren, HostBinding, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {ObUnsubscribable} from '../../unsubscribe.class';
import {ObScrollingEvents} from '../../scrolling/scrolling.module';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues, scrollEnabled} from '../master-layout.utility';

@Component({
	selector: 'ob-master-layout-footer',
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-footer'}
})
export class ObMasterLayoutFooterComponent extends ObUnsubscribable {
	home = this.config.homePageRoute;
	isCustom = this.masterLayout.footer.isCustom;
	@HostBinding('class.application-footer-sm') isSmall = this.masterLayout.footer.isSmall;
	@ContentChildren('obFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: ObMasterLayoutService,
				private readonly config: ObMasterLayoutConfig,
				private readonly scrollEvents: ObScrollingEvents) {
		super();

		this.propertyChanges();
		this.reduceOnScroll();
	}

	private propertyChanges() {
		const events = [ObEMasterLayoutEventValues.SMALL, ObEMasterLayoutEventValues.CUSTOM];
		this.masterLayout.footer.configEvents.pipe(
			filter((evt: ObIMasterLayoutEvent) => events.includes(evt.name)),
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			switch (event.name) {
				case ObEMasterLayoutEventValues.SMALL:
					this.isSmall = event.value;
					break;
				case ObEMasterLayoutEventValues.CUSTOM:
					this.isCustom = event.value;
					break;
			}
		});
	}

	private reduceOnScroll() {
		this.scrollEvents.isScrolled.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.footer))
			.subscribe((isScrolling) => this.masterLayout.footer.isSmall = !isScrolling);
	}
}

