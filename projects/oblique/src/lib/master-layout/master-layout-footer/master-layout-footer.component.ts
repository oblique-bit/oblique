import {Component, ContentChildren, HostBinding, OnDestroy, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {scrollEnabled} from '../master-layout.utility';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {Subject} from 'rxjs';

@Component({
	selector: 'ob-master-layout-footer',
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-master-layout-footer'}
})
export class ObMasterLayoutFooterComponent implements OnDestroy {
	home = this.config.homePageRoute;
	isCustom = this.masterLayout.footer.isCustom;
	@HostBinding('class.ob-master-layout-footer-sm') isSmall = this.masterLayout.footer.isSmall;
	@ContentChildren('obFooterLink') readonly templates: QueryList<TemplateRef<any>>;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		private readonly scrollEvents: ObScrollingEvents
	) {
		this.propertyChanges();
		this.reduceOnScroll();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private propertyChanges() {
		const events = [ObEMasterLayoutEventValues.SMALL, ObEMasterLayoutEventValues.CUSTOM];
		this.masterLayout.footer.configEvents
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => events.includes(evt.name)),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
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
		this.scrollEvents.isScrolled
			.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.footer))
			.subscribe(isScrolling => (this.masterLayout.footer.isSmall = !isScrolling));
	}
}
