import {Component, HostBinding} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {ScrollingConfig} from '../scrolling';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

export interface ORFooterLink {
	url: string;
	label: string;
	title?: string;
	external?: boolean;
}

@Component({
	selector: 'or-master-layout-footer',
	template: `
		<div class="footer-item footer-item-logo footer-sm-collapse">
			<a href="{{'i18n.application.organization.url' | translate}}" target="_blank" class="application-brand-logo">
				<img src="./assets/styles/images/logo.svg"
					 alt="{{'i18n.application.organization.name' | translate}}"/>
			</a>
		</div>
		<div class="footer-item footer-item-info">
			<ng-content select="[orFooterInfo]"></ng-content>
			<div class="footer-sm-collapse">
				<ng-content select="[orFooterInfoSMCollapse]"></ng-content>
			</div>
		</div>
		<div class="footer-item footer-item-links">
			<ng-content select="[orFooterLinks]" *ngIf="!footerLinks.length"></ng-content>
			<ul class="list-unstyled small d-flex flex-row justify-content-lg-end" role="menu" *ngIf="footerLinks.length">
				<li role="presentation" *ngFor="let link of footerLinks">
					<a [href]="link.url" class="link" [attr.title]="link.title | translate" [attr.target]="link.external ? '_blank' : undefined">
						{{link.label | translate}}
					</a>
				</li>
			</ul>
		</div>
	`
})
export class MasterLayoutFooterComponent extends Unsubscribable {
	footerLinks: ORFooterLink[];

	@HostBinding('class.application-footer-sm') small: boolean;
	@HostBinding('class.application-footer') private app = true;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scroll: ScrollingConfig) {
		super();

		this.small = this.config.footer.small;
		this.footerLinks = this.config.footer.links;
		this.footerLinks.forEach((link) => {
			link.external = link.url.startsWith('http');
		});

		this.updateFooterSmall();
		this.footerTransitions();
	}

	private updateFooterSmall(): void {
		this.masterLayout.smallFooter = this.small;
		this.masterLayout.footerSmallEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.small = value;
		});
	}

	private footerTransitions(): void {
		if (this.scroll.transitions.footer) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.small = !isScrolling;
				});
		}
	}
}
