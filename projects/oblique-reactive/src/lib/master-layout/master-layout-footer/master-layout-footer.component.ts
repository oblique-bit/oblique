import {Component, ContentChildren, HostBinding, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../../unsubscribe.class';
import {ScrollingEvents} from '../../scrolling/scrolling.module';
import {MasterLayoutService} from '../master-layout.service';
import {MasterLayoutConfig} from '../master-layout.config';

@Component({
	selector: 'or-master-layout-footer',
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-footer'}
})
export class MasterLayoutFooterComponent extends Unsubscribable {
	home: string;
	custom = false;
	@HostBinding('class.application-footer-sm') small: boolean;
	@ContentChildren('orFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scrollEvents: ScrollingEvents) {
		super();

		this.small = this.config.footer.small;
		this.custom = this.config.footer.custom;
		this.home = this.config.homePageRoute;

		this.updateFooterSmall();
		this.updateFooterCustom();
		this.footerTransitions();
	}

	private updateFooterSmall(): void {
		this.masterLayout.smallFooter = this.small;
		this.masterLayout.footerSmallChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.small = value;
		});
	}

	private updateFooterCustom(): void {
		this.masterLayout.customFooter = this.custom;
		this.masterLayout.footerCustomChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.custom = value;
		});
	}

	private footerTransitions(): void {
		if (this.config.footer.scrollTransitions) {
			this.scrollEvents.scrolled.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.small = !isScrolling;
				});
		}
	}
}
