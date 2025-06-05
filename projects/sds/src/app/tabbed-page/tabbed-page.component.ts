import {Component, HostListener, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, UrlSerializer} from '@angular/router';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../code-examples/code-example.directive';
import {getCodeExampleComponent} from '../code-examples/code-examples.mapper';
import {Observable, concatWith, filter, first, map, partition, switchMap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {urlConst} from '../shared/url/url.const';
import {IdPipe} from '../shared/id/id.pipe';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {CommonModule, Location} from '@angular/common';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import {CmsData, TabbedPageComplete, UiUxData, UiUxEntry} from '../cms/models/tabbed-page.model';
import {getTabNameFromUrlParam, getUrlParamForTabName} from './utils/tab-name-mapper';
import {MatChipsModule} from '@angular/material/chips';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {VersionService} from '../shared/version/version.service';
import {UiUxComponent} from '../ui-ux/ui-ux.component';

@Component({
	selector: 'app-tabbed-page',
	templateUrl: './tabbed-page.component.html',
	styleUrl: './tabbed-page.component.scss',
	imports: [TabsComponent, TabComponent, UiUxComponent, CodeExampleDirective, CommonModule, IdPipe, SafeHtmlPipe, MatChipsModule],
	host: {class: 'content-page'},
	hostDirectives: [CdkScrollable]
})
export class TabbedPageComponent {
	readonly componentId = 'tabbed-page';
	readonly cmsData$: Observable<CmsData>;
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly location = inject(Location);
	private isNull = true;
	private readonly serializer = inject(UrlSerializer);
	private readonly versionService = inject(VersionService);

	constructor() {
		const [validPageId$, invalidPageId$] = this.buildPageIdObservables();
		invalidPageId$.pipe(takeUntilDestroyed()).subscribe(() => {
			void this.router.navigate(['..', 'invalid']);
		});

		this.cmsData$ = this.buildCmsDataObservable(validPageId$);
	}

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent): void {
		const {target} = event;
		if (!(target instanceof HTMLAnchorElement) || !target.closest('.deprecation-container')) {
			return;
		}
		event.preventDefault();
		void this.router.navigate([target.pathname]);
	}

	handleTabChanged(tabName: string): void {
		const urlParamForTab: string = getUrlParamForTabName(tabName); //newly requested tab
		const newUrl = this.serializer.serialize(
			this.router.createUrlTree([urlParamForTab], {
				relativeTo: this.activatedRoute.parent,
				queryParamsHandling: 'preserve',
				preserveFragment: true
			})
		);
		this.location.replaceState(newUrl);

		const {fragment} = this.activatedRoute.snapshot;
		if (fragment) {
			const el = document.getElementById(fragment);
			el?.scrollIntoView();
		}
	}

	private buildPageIdObservables(): [Observable<number>, Observable<number>] {
		return partition(
			this.slugToIdService.readyToMap.pipe(
				first(),
				concatWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
				map(() => this.activatedRoute.snapshot.paramMap.get(urlConst.urlParams.selectedSlug) ?? ''),
				map(slug => this.slugToIdService.getIdForSlug(slug))
			),
			id => id !== undefined
		);
	}

	private buildCmsDataObservable(validPageId$: Observable<number>): Observable<CmsData> {
		return validPageId$.pipe(
			switchMap(id => this.cmsDataService.getTabbedPageComplete(id)),
			map(cmsData => this.buildCmsData(cmsData.data))
		);
	}

	private buildCmsData(cmsData: TabbedPageComplete): CmsData {
		const baseUrl = this.versionService.getBaseUrl();
		return {
			title: cmsData.name,
			api: baseUrl ? cmsData.api.replace('https://v17.material.angular.io/', baseUrl) : cmsData.api,
			uiUx: this.buildUiUxData(cmsData),
			source: getCodeExampleComponent(cmsData.slug),
			tab: this.getSelectedTab(),
			deprecation: cmsData.deprecation
		};
	}

	private getSelectedTab(): string {
		// the selected tab is reevaluated each time the URL changes and is passed to the child component as input. Unfortunately, when the URL
		// changes but the selected tab remains "undefined", there is no change to the input value and the child component isn't reevaluated.
		// to circumvent this problem, "undefined" is converted to "null" every other times so that the input has a new value each time the URL
		// changes
		return (
			getTabNameFromUrlParam(this.activatedRoute.snapshot.paramMap.get(urlConst.urlParams.selectedTab)) ||
			this.toggleBetweenNullAndUndefined()
		);
	}

	private toggleBetweenNullAndUndefined(): null | undefined {
		this.isNull = !this.isNull;
		return this.isNull ? null : undefined;
	}

	private buildUiUxData(cmsData: TabbedPageComplete): UiUxData {
		const data: UiUxData = {};
		// we take every field that we need and map the value from Directus to it
		['purpose', 'additionalInfo', 'generalRules', 'do', 'doNot', 'relatedLinks', 'designFileLatest', 'designFilePrevious']
			.map(property => ({property, cmsProperty: this.mapCMSProperty(property)}))
			.map(({property, cmsProperty}) => ({property, cmsUiUxData: cmsData[cmsProperty] as string | UiUxEntry[]}))
			.filter(({cmsUiUxData}) => cmsUiUxData?.length) // Directus provides all fields, even empty ones
			.forEach(({property, cmsUiUxData}) => {
				// Directus provides either a String, which requires no further processing, or a UiUxEntry, where the value needs to be extracted
				// and cleaned up. UiUxEntry will be used as list elements.
				data[property] = Array.isArray(cmsUiUxData) ? this.processListItems(cmsUiUxData) : cmsUiUxData;
			});

		return Object.keys(data).length === 0 ? undefined : data;
	}

	private processListItems(cmsUiUxData: UiUxEntry[]): string[] {
		// Directus wraps each entry in a paragraph tag, which needs to be removed for items that will be rendered in an HTML list.
		// Directus includes unnecessary data that cannot be excluded in advance; only the `text` property is needed
		return cmsUiUxData.map((item: UiUxEntry) => this.removeParagraphTags(item.text));
	}

	private mapCMSProperty(property: string): string {
		// Directus naming convention is not compatible with Eslint, which means we need to map `ui_ux_snake_case` to `camelCase`.
		return `ui_ux_${this.camelCaseToSnakeCase(property)}`;
	}

	private camelCaseToSnakeCase(item: string): string {
		return item.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
	}

	private removeParagraphTags(item: string): string {
		return item.replace(/<\/?p>/g, '');
	}
}
