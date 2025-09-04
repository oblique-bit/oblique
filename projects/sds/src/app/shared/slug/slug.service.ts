import {Injectable, inject} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class SlugService {
	private readonly router = inject(Router);

	getNewSlug(version: number): string | undefined {
		const slug = this.getCurrentSlug();
		switch (version) {
			case 11:
				return this.redirectVersion11(slug);
			case 12:
				return this.redirectVersion12(slug);
			case 13:
				return this.redirectVersion13(slug);
			case 14:
				return this.redirectVersion14(slug);
			default:
				return undefined;
		}
	}

	private getCurrentSlug(): string {
		return this.router.url
			.replace(/[#|?].*/u, '') // remove queryParams & fragment
			.replace(/\/(?:api|ui-ux|examples)/u, '')
			.split('/')
			.pop();
	}

	private redirectVersion11(slug: string): string | undefined {
		switch (slug) {
			case 'button-14':
				return 'button';
			case 'column-layout-14':
				return 'column-layout';
			case 'configuration-12':
			case 'configuration-14':
				return 'configuration';
			case 'date-14':
				return 'date';
			case 'master-layout-12':
			case 'master-layout-13':
			case 'master-layout-14':
				return 'master-layout';
			case 'popover-12':
				return 'popover';
			case 'provide-oblique-configuration-14':
				return 'provide-oblique-configuration';
			case 'service-navigation-web-component-14':
				return 'service-navigation-web-component';
			case 'typography-14':
				return 'typography';
			case 'shadow':
			case 'getting-started-figma':
			case 'getting-started-as-a-designer':
				return 'invalid';
			default:
				return undefined;
		}
	}

	private redirectVersion12(slug: string): string | undefined {
		switch (slug) {
			case 'button-14':
				return 'button';
			case 'column-layout-14':
				return 'column-layout';
			case 'configuration':
			case 'configuration-14':
				return 'configuration-12';
			case 'date-14':
				return 'date';
			case 'master-layout':
			case 'master-layout-13':
			case 'master-layout-14':
				return 'master-layout-12';
			case 'popover':
				return 'popover-12';
			case 'provide-oblique-configuration-14':
				return 'provide-oblique-configuration';
			case 'service-navigation-web-component-14':
				return 'service-navigation-web-component';
			case 'typography-14':
				return 'typography';
			case 'language':
			case 'datepicker':
			case 'getting-started-figma':
			case 'getting-started-as-a-designer':
				return 'invalid';
			default:
				return undefined;
		}
	}

	private redirectVersion13(slug: string): string | undefined {
		switch (slug) {
			case 'button-14':
				return 'button';
			case 'column-layout-14':
				return 'column-layout';
			case 'configuration':
			case 'configuration-14':
				return 'configuration-12';
			case 'date-14':
				return 'date';
			case 'master-layout':
			case 'master-layout-12':
			case 'master-layout-14':
				return 'master-layout-13';
			case 'popover':
				return 'popover-12';
			case 'provide-oblique-configuration-14':
				return 'provide-oblique-configuration';
			case 'service-navigation-web-component-14':
				return 'service-navigation-web-component';
			case 'typography-14':
				return 'typography';
			case 'language':
			case 'datepicker':
				return 'invalid';
			default:
				return undefined;
		}
	}

	private redirectVersion14(slug: string): string | undefined {
		switch (slug) {
			case 'button':
				return 'button-14';
			case 'column-layout':
				return 'column-layout-14';
			case 'configuration':
			case 'configuration-12':
				return 'configuration-14';
			case 'date':
				return 'date-14';
			case 'master-layout':
			case 'master-layout-12':
			case 'master-layout-13':
				return 'master-layout-14';
			case 'popover':
				return 'popover-12';
			case 'provide-oblique-configuration':
				return 'provide-oblique-configuration-14';
			case 'service-navigation-web-component':
				return 'service-navigation-web-component-14';
			case 'typography':
				return 'typography-14';
			case 'language':
			case 'datepicker':
				return 'invalid';
			default:
				return undefined;
		}
	}
}
