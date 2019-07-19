import {Component, ContentChildren, HostBinding, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../../unsubscribe.class';
import {ScrollingEvents} from '../../scrolling/scrolling.module';
import {MasterLayoutService} from '../master-layout.service';
import {MasterLayoutConfig} from '../master-layout.config';
import {MasterLayoutEvent, MasterLayoutEventValues, scrollEnabled} from '../master-layout.utility';

@Component({
	selector: 'or-master-layout-footer',
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-footer'}
})
export class MasterLayoutFooterComponent extends Unsubscribable {
	home = this.config.homePageRoute;
	isCustom = this.masterLayout.footer.isCustom;
	@HostBinding('class.application-footer-sm') isSmall = this.masterLayout.footer.isSmall;
	@ContentChildren('orFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scrollEvents: ScrollingEvents) {
		super();

		this.propertyChanges();
		this.reduceOnScroll();
	}

	private propertyChanges() {
		const events = [MasterLayoutEventValues.SMALL, MasterLayoutEventValues.CUSTOM];
		this.masterLayout.footer.configEvents.pipe(
			filter((evt: MasterLayoutEvent) => events.includes(evt.name)),
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			switch (event.name) {
				case MasterLayoutEventValues.SMALL:
					this.isSmall = event.value;
					break;
				case MasterLayoutEventValues.CUSTOM:
					this.isCustom = event.value;
					break;
			}
		});
	}

	private reduceOnScroll() {
		this.scrollEvents.isScrolled.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.footer.configEvents))
			.subscribe((isScrolling) => {
				this.isSmall = !isScrolling;
			});
	}
}

