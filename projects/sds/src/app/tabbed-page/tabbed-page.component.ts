import {Component, OnInit, Type, ViewChild, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../code-examples/code-example.directive';
import {CodeExamplesMapper} from '../code-examples/code-examples.mapper';
import {CodeExamples} from '../code-examples/code-examples.model';
import {Observable, ReplaySubject, distinctUntilChanged, filter, map, mergeWith, share, switchMap, tap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {IdPipe} from '../shared/id/id.pipe';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {CommonModule, Location} from '@angular/common';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import {CmsData, TabbedPageComplete} from '../cms/models/tabbed-page.model';
import {TabNameMapper} from './utils/tab-name-mapper';

@Component({
	selector: 'app-tabbed-page',
	templateUrl: './tabbed-page.component.html',
	styleUrls: ['./tabbed-page.component.scss'],
	standalone: true,
	imports: [TabsComponent, TabComponent, CodeExampleDirective, CommonModule, IdPipe, SafeHtmlPipe]
})
export class TabbedPageComponent implements OnInit {
	@ViewChild(CodeExampleDirective, {static: false}) codeExample!: CodeExampleDirective;
	@ViewChild('tabs') tabs: TabsComponent;
	readonly componentId = 'tabbed-page';
	public cmsData$: Observable<CmsData>;
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly location = inject(Location);

	ngOnInit(): void {
		this.cmsData$ = this.buildCmsDataObservable();
	}

	handleTabChanged(tabName: string): void {
		const urlParamForTab: string = TabNameMapper.getUrlParamForTabName(tabName);
		const snapshotTabParam = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedTab);
		let fragment: RegExpExecArray;

		//if we don't navigate using the sidebar navigation but directly, check for a fragment
		if (this.location.path(true) === this.router.url && snapshotTabParam === urlParamForTab) {
			//getting fragment using path and not snapshot because snapshot is not up to date
			fragment = /(?<=#).*/.exec(this.location.path(true));
		}

		const params = fragment ? `${urlParamForTab}#${fragment[0]}` : urlParamForTab;
		const newUrl: string = snapshotTabParam ? this.router.url.replace(/[^/]*$/, params) : `${this.router.url}/${params}`;
		this.location.replaceState(newUrl);

		if (fragment) {
			const el = document.getElementById(fragment[0]);
			el?.scrollIntoView();
		}
	}

	private buildCmsDataObservable(): Observable<CmsData> {
		return this.slugToIdService.readyToMap.pipe(
			mergeWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
			map(() => this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
			distinctUntilChanged(),
			map(slug => this.slugToIdService.getIdForSlug(slug)),
			switchMap(id => this.cmsDataService.getTabbedPageComplete(id)),
			map(cmsData => this.buildCmsData(cmsData.data)),
			tap(cmsData => this.loadCodeExample(cmsData.source)),
			tap(cmsData => this.activateTab(cmsData)),
			share({connector: () => new ReplaySubject(1)})
		);
	}

	private buildCmsData(cmsData: TabbedPageComplete): CmsData {
		return {
			title: cmsData.name,
			api: cmsData.api,
			uiUx: cmsData.ui_ux,
			source: CodeExamplesMapper.getCodeExampleComponent(cmsData.slug)
		};
	}

	private loadCodeExample(codeExampleComponent: Type<CodeExamples> | undefined): void {
		const {viewContainerRef} = this.codeExample;
		viewContainerRef.clear();

		if (codeExampleComponent) {
			viewContainerRef.createComponent<CodeExamples>(codeExampleComponent);
		}
	}

	private activateTab(cmsData: CmsData): void {
		if (cmsData.api || cmsData.source || cmsData.uiUx) {
			const tabToSelect: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedTab) ?? '';
			// setTimeout delays the tab selection until the view is initialized and the tabs are available
			setTimeout(() => this.tabs.selectTabWithName(TabNameMapper.getTabNameFromUrlParam(tabToSelect)));
		}
	}
}
