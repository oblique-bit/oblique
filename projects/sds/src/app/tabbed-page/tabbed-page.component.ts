import {Component, OnDestroy, OnInit, Type, ViewChild, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../code-examples/code-example.directive';
import {CodeExamplesMapper} from '../code-examples/code-examples.mapper';
import {CodeExamples} from '../code-examples/code-examples.model';
import {
	Observable,
	ReplaySubject,
	Subject,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	mergeWith,
	share,
	switchMap,
	takeUntil,
	tap
} from 'rxjs';
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
export class TabbedPageComponent implements OnInit, OnDestroy {
	@ViewChild(CodeExampleDirective, {static: false}) codeExample!: CodeExampleDirective;
	@ViewChild('tabs') tabs: TabsComponent;
	readonly componentId = 'tabbed-page';
	public cmsData$: Observable<CmsData>;

	private readonly unsubscribe = new Subject<void>();

	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly location = inject(Location);

	ngOnInit(): void {
		this.monitorForSlugToIdChanges();
		this.monitorForPageChanges();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	handleTabChanged(tabName: string): void {
		const urlParamForTab: string = TabNameMapper.getUrlParamForTabName(tabName);

		const newUrl: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedTab)
			? this.router.url.replace(/[^/]*$/, urlParamForTab)
			: `${this.router.url}/${urlParamForTab}`;

		this.location.replaceState(newUrl);
	}

	private monitorForPageChanges(): void {
		this.cmsData$.pipe(takeUntil(this.unsubscribe), debounceTime(1)).subscribe(cmsData => {
			if (cmsData.api || cmsData.source || cmsData.uiUx) {
				const tabToSelect: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedTab) ?? '';
				this.tabs.selectTabWithName(TabNameMapper.getTabNameFromUrlParam(tabToSelect));
			}
		});
	}

	private loadCodeExample(codeExampleComponent: Type<CodeExamples> | undefined): void {
		const {viewContainerRef} = this.codeExample;
		viewContainerRef.clear();

		if (codeExampleComponent) {
			viewContainerRef.createComponent<CodeExamples>(codeExampleComponent);
		}
	}

	private monitorForSlugToIdChanges(): void {
		this.cmsData$ = this.slugToIdService.readyToMap.pipe(
			mergeWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
			map(() => this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
			distinctUntilChanged(),
			map(slug => this.slugToIdService.getIdForSlug(slug)),
			switchMap(id => this.cmsDataService.getTabbedPageComplete(id)),
			map(cmsData => this.buildCmsData(cmsData.data)),
			tap(cmsData => this.loadCodeExample(cmsData.source)),
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
}
