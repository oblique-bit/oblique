import {Component, OnDestroy, OnInit, Type, ViewChild, inject} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../code-examples/code-example.directive';
import {CodeExamplesMapper} from '../code-examples/code-examples.mapper';
import {CodeExamples} from '../code-examples/code-examples.model';
import {BehaviorSubject, Observable, Subject, combineLatestWith, debounceTime, delay, filter, takeUntil} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {IdPipe} from '../shared/id/id.pipe';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {CommonModule, Location} from '@angular/common';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
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

	title = '';

	public apiContent$: Observable<SafeHtml>;
	public codeExampleComponent$: Observable<Type<CodeExamples> | undefined>;
	public uiUxContent$: Observable<SafeHtml>;

	private readonly apiContentSource: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>('');
	private readonly codeExampleComponentSource: BehaviorSubject<Type<CodeExamples> | undefined> = new BehaviorSubject<
		Type<CodeExamples> | undefined
	>(undefined);
	private readonly uiUxContentSource: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>('');

	private readonly unsubscribe = new Subject<void>();

	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly location = inject(Location);
	private previousSlug: string;

	ngOnInit(): void {
		this.initObservables();
		this.monitorForPageChanges();
		this.monitorForSlugToIdChanges();
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

	private initObservables(): void {
		this.apiContent$ = this.apiContentSource.asObservable();
		this.codeExampleComponent$ = this.codeExampleComponentSource.asObservable();
		this.uiUxContent$ = this.uiUxContentSource.asObservable();
	}

	private monitorForPageChanges(): void {
		this.apiContent$
			.pipe(takeUntil(this.unsubscribe), combineLatestWith(this.codeExampleComponent$, this.uiUxContent$), debounceTime(1))
			.subscribe(next => {
				const apiContent = next[0];
				const codeExampleComponent = next[1];
				const uiUxContent = next[2];

				if (apiContent || codeExampleComponent || uiUxContent) {
					this.loadCodeExample(codeExampleComponent);
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
		this.slugToIdService.readyToMap.pipe(takeUntil(this.unsubscribe), delay(0)).subscribe(() => {
			this.getContentForSelectedSlug();
			this.monitorForNavigationEndEvents();
		});
	}

	private monitorForNavigationEndEvents(): void {
		this.router.events
			.pipe(
				takeUntil(this.unsubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => {
				this.getContentForSelectedSlug();
			});
	}

	private getContentForSelectedSlug(): void {
		const slug: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? '';
		if (slug !== this.previousSlug) {
			const id: number = this.slugToIdService.getIdForSlug(slug);
			this.getContent(id);
		}
		this.previousSlug = slug;
	}

	private getContent(id: number): void {
		this.cmsDataService
			.getTabbedPageComplete(id)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(cmsData => {
				this.title = cmsData.data.name;
				this.apiContentSource.next(cmsData.data.api);
				this.uiUxContentSource.next(cmsData.data.ui_ux);
				this.codeExampleComponentSource.next(CodeExamplesMapper.getCodeExampleComponent(cmsData.data.slug));
			});
	}
}
