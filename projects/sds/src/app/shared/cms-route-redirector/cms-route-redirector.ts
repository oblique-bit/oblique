import {Injectable, inject} from '@angular/core';
import {NavigationEnd, type Params, Router} from '@angular/router';
import {WINDOW} from '@oblique/oblique';
import {type Observable, Subject, map, merge, withLatestFrom} from 'rxjs';
import {filter} from 'rxjs/operators';
import type {CMSPageShort, CMSPages} from '../../cms/models/cms-page.model';
import {humanizeList} from '../humanize/humanize';

@Injectable({
	providedIn: 'root',
})
export class CmsRouteRedirector {
	private readonly router = inject(Router);
	private readonly window = inject(WINDOW);
	private readonly navigation$ = new Subject<string>();
	private readonly route$ = this.router.events.pipe(
		filter(event => event instanceof NavigationEnd),
		map(event => event.url)
	);

	redirectOnVersionChange(pages$: Observable<CMSPages>, version$: Observable<number>): void {
		const pagesShort$ = this.mapToPageShort(pages$);
		merge(
			version$.pipe(
				withLatestFrom(pagesShort$, this.route$),
				map(([version, pages, route]) => ({route, version, pages}))
			),
			this.navigation$.pipe(
				withLatestFrom(pagesShort$, version$),
				map(([route, pages, version]) => ({route, version, pages}))
			)
		)
			.pipe(map(({route, version, pages}) => this.buildRouteParts(route, version, pages)))
			.subscribe(({routeSegments, fragment, queryParams}) => {
				// use provided fragment and/or query parameters for the new route or preserve existing ones from the old route
				void this.router.navigate(routeSegments, {
					fragment,
					queryParams,
					queryParamsHandling: Object.keys(queryParams).length > 0 ? undefined : 'preserve',
					preserveFragment: fragment === '',
				});
			});
	}

	navigate(origin: string, route: string): void {
		if (origin === this.window.location.origin) {
			this.navigation$.next(route);
		} else {
			this.window.open(`${origin}${route}`, '_blank', 'noopener,noreferrer');
		}
	}

	private buildRouteParts(
		route: string,
		version: number,
		pages: CMSPageShort[]
	): {routeSegments: string[]; fragment: string; queryParams: Params} {
		const origin = route.startsWith('http') ? undefined : this.window.location.origin;
		const {pathname, hash, searchParams} = new URL(route, origin);
		return {
			routeSegments: this.createRouteSegments(pathname, version, pages),
			fragment: hash.replace('#', ''),
			queryParams: Object.fromEntries(searchParams.entries()),
		};
	}

	private mapToPageShort(pages$: Observable<CMSPages>): Observable<CMSPageShort[]> {
		return pages$.pipe(
			map(({tabbedPages, textPages}) => [...tabbedPages.data, ...textPages.data]),
			map(pages =>
				// eslint-disable-next-line @typescript-eslint/naming-convention
				pages.map(({slug, min_version, max_version}) => ({
					slug,
					minVersion: min_version ?? -Infinity,
					maxVersion: max_version ?? Infinity,
				}))
			)
		);
	}

	private createRouteSegments(pathname: string, version: number, pages: CMSPageShort[]): string[] {
		const [category, slug, tab] = pathname.split('/').filter(Boolean);
		if (!category) {
			return ['/'];
		}
		const newSlug = this.resolveSlugForVersion(version, pages, slug);
		return [`/${category}`, newSlug, tab].filter(Boolean);
	}

	private resolveSlugForVersion(currentVersion: number, pages: CMSPageShort[], currentSlug: string): string {
		const baseSlug = this.removeVersionFromSlug(currentSlug);
		const validPages = this.findValidPagesForVersion(pages, currentVersion, baseSlug);
		if (validPages.length === 0) {
			return 'invalid';
		}

		if (validPages.length > 1) {
			const slugs = validPages.map(page => page.slug);
			console.error(`${humanizeList(slugs)} slugs are valid for version ${currentVersion}.`);
		}

		return validPages[0].slug;
	}

	private removeVersionFromSlug(slug: string): string {
		return slug.replace(/-\d+$/u, '');
	}

	private findValidPagesForVersion(pages: CMSPageShort[], version: number, baseSlug: string): CMSPageShort[] {
		return pages.filter(
			({slug, minVersion, maxVersion}) =>
				this.isSlugCompatible(slug, baseSlug) && minVersion <= version && maxVersion >= version
		);
	}

	private isSlugCompatible(slug: string, baseSlug: string): boolean {
		return new RegExp(`^${baseSlug}(?:-\\d+)?$`, 'u').test(slug);
	}
}
