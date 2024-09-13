import {Component, HostListener, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, UrlSerializer} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../code-examples/code-example.directive';
import {CodeExamplesMapper} from '../code-examples/code-examples.mapper';
import {Observable, distinctUntilChanged, filter, map, mergeWith, partition, switchMap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {IdPipe} from '../shared/id/id.pipe';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {CommonModule, Location} from '@angular/common';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import {CmsData, TabbedPageComplete} from '../cms/models/tabbed-page.model';
import {TabNameMapper} from './utils/tab-name-mapper';
import {MatChipsModule} from '@angular/material/chips';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-tabbed-page',
	templateUrl: './tabbed-page.component.html',
	styleUrls: ['./tabbed-page.component.scss'],
	standalone: true,
	imports: [TabsComponent, TabComponent, CodeExampleDirective, CommonModule, IdPipe, SafeHtmlPipe, MatChipsModule]
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

	constructor() {
		const [validPageId$, invalidPageId$] = this.buildPageIdObservables();
		invalidPageId$.pipe(takeUntilDestroyed()).subscribe(() => {
			void this.router.navigate(['introductions', 'welcome']);
		});

		this.cmsData$ = this.buildCmsDataObservable(validPageId$);
	}

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent): void {
		const {target} = event;
		if (!(target instanceof HTMLAnchorElement)) {
			return;
		}
		event.preventDefault();
		void this.router.navigate([target.pathname]);
	}

	handleTabChanged(tabName: string): void {
		const urlParamForTab: string = TabNameMapper.getUrlParamForTabName(tabName); //newly requested tab
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
				mergeWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
				map(() => this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
				distinctUntilChanged(),
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
		return {
			title: cmsData.name,
			api: cmsData.api,
			uiUx: cmsData.ui_ux,
			source: CodeExamplesMapper.getCodeExampleComponent(cmsData.slug),
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
			TabNameMapper.getTabNameFromUrlParam(this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedTab)) ||
			this.toggleBetweenNullAndUndefined()
		);
	}

	private toggleBetweenNullAndUndefined(): null | undefined {
		this.isNull = !this.isNull;
		return this.isNull ? null : undefined;
	}
}
