import {Component, ContentChildren, HostBinding, QueryList, TemplateRef} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {ScrollingConfig} from '../scrolling/scrolling.module';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

@Component({
	selector: 'or-master-layout-footer',
	template: `
		<ng-content select="[orFooter]" *ngIf="custom"></ng-content>
		<ng-container *ngIf="!custom">
			<div class="footer-item footer-item-logo footer-sm-collapse">
				<a [routerLink]="home" class="application-brand-logo">
					<img src="./assets/styles/images/logo.svg" alt="{{'i18n.application.organization.name' | translate}}"/>
				</a>
			</div>
			<div class="footer-item footer-item-info">
				<ng-content select="[orFooterInfo]"></ng-content>
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
	home: string;
	custom = false;
	@HostBinding('class.application-footer-sm') small: boolean;
	@ContentChildren('orFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scroll: ScrollingConfig) {
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
		this.masterLayout.footerSmallEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.small = value;
		});
	}

	private updateFooterCustom(): void {
		this.masterLayout.customFooter = this.custom;
		this.masterLayout.footerCustomEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.custom = value;
		});
	}

	private footerTransitions(): void {
		if (this.config.footer.scrollTransitions) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.small = !isScrolling;
				});
		}
	}
}
