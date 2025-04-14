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
			case 10:
				return 'welcome-10';
			case 11:
				return this.redirectVersion11(slug);
			case 12:
				return this.redirectVersion12(slug);
			case 13:
				return this.redirectVersion13(slug);
			default:
				return undefined;
		}
	}

	private getCurrentSlug(): string {
		return this.router.url
			.replace(/[#|?].*/, '') // remove queryParams & fragment
			.replace(/\/(?:api|ui-ux|examples)/, '')
			.split('/')
			.pop();
	}

	private redirectVersion11(slug: string): string | undefined {
		switch (slug) {
			case 'welcome-10':
				return 'welcome';
			case 'configuration-12':
				return 'configuration';
			case 'master-layout-12':
			case 'master-layout-13':
				return 'master-layout';
			case 'popover-12':
				return 'popover';
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
			case 'welcome-10':
				return 'welcome';
			case 'configuration':
				return 'configuration-12';
			case 'master-layout':
			case 'master-layout-13':
				return 'master-layout-12';
			case 'popover':
				return 'popover-12';
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
			case 'welcome-10':
				return 'welcome';
			case 'configuration':
				return 'configuration-12';
			case 'master-layout':
			case 'master-layout-12':
				return 'master-layout-13';
			case 'popover':
				return 'popover-12';
			case 'language':
			case 'datepicker':
				return 'invalid';
			default:
				return undefined;
		}
	}
}
