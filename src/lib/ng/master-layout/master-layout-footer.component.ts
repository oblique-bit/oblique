import {Component, Input, OnInit} from '@angular/core';

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
				<img src="./assets/oblique-ui/images/logo.svg"
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
			<ul class="list-unstyled small d-flex flex-row justify-content-lg-end" role="menu">
				<li role="presentation" *ngFor="let link of footerLinks">
					<a [href]="link.url" class="link" [attr.title]="link.title" [attr.target]="link.external ? '_blank' : undefined">
						{{link.label | translate}}
					</a>
				</li>
			</ul>
		</div>
	`
})
export class MasterLayoutFooterComponent implements OnInit {
	@Input() footerLinks: ORFooterLink[];

	ngOnInit() {
		this.footerLinks = this.footerLinks || [{url: 'http://www.disclaimer.admin.ch', label: 'Legal', title: 'Terms and conditions'}];
		this.footerLinks.forEach((link) => {
			link.external = link.url.startsWith('http');
		});
	}
}
