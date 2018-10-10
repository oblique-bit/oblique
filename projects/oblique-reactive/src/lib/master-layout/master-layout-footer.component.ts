import {Component, ContentChildren, HostBinding, QueryList, TemplateRef} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {ScrollingConfig} from '../scrolling';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

@Component({
	selector: 'or-master-layout-footer',
	template: `
		<ng-content select="[orFooter]" *ngIf="custom"></ng-content>
		<ng-container *ngIf="!custom">
			<div class="footer-item footer-item-logo footer-sm-collapse">
				<a href="{{'i18n.application.organization.url' | translate}}" target="_blank" class="application-brand-logo">
					<img src="./assets/styles/images/logo.svg" alt="{{'i18n.application.organization.name' | translate}}"/>
				</a>
			</div>
			<div class="footer-item footer-item-info">
				<ng-content select="[orFooterInfo]"></ng-content>
				<div class="footer-sm-collapse">
					<ng-content select="[orFooterInfoSMCollapse]"></ng-content>
				</div>
			</div>
			<div class="footer-item footer-item-links" *ngIf="templates.length">
				<ul class="list-unstyled small d-flex flex-row justify-content-lg-end" role="menu">
					<li role="presentation" *ngFor="let template of templates">
						<ng-container [ngTemplateOutlet]="template"></ng-container>
					</li>
				</ul>
			</div>
		</ng-container>
	`,
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application-footer'}
})
export class MasterLayoutFooterComponent extends Unsubscribable {
	custom = false;
	@HostBinding('class.application-footer-sm') small: boolean;
	@ContentChildren('orFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scroll: ScrollingConfig) {
		super();

		this.small = this.config.footer.small;
		this.custom = this.config.footer.custom;

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
