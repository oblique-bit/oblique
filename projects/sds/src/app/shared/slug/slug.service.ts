import {Injectable, inject} from '@angular/core';
import {Router} from '@angular/router';
import type {CMSPageShort} from '../../cms/models/cms-page.model';

@Injectable({
	providedIn: 'root',
})
export class SlugService {
	private readonly router = inject(Router);

	getNewSlug(currentVersion: number, versionedPages: CMSPageShort[]): string | undefined {
		const currentSlug = this.getCurrentSlug();
		const baseSlug = currentSlug.replace(/-\d+$/u, '');
		const page = versionedPages.find(({slug}) => slug === currentSlug);

		// the current slug is valid with the current version
		if (!page || (page.minVersion <= currentVersion && page.maxVersion >= currentVersion)) {
			return undefined;
		}

		// redirect to an existing suitable slug or to "invalid"
		return (
			versionedPages.find(
				({slug, minVersion, maxVersion}) =>
					slug.startsWith(baseSlug) && minVersion <= currentVersion && maxVersion >= currentVersion
			)?.slug ?? 'invalid'
		);
	}

	private getCurrentSlug(): string {
		return this.router.url
			.replace(/[#|?].*/u, '') // remove queryParams & fragment
			.replace(/\/(?:api|ui-ux|examples)/u, '')
			.split('/')
			.pop();
	}
}
