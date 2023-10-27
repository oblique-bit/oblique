import {Component, OnDestroy, OnInit, Type, ViewChild, inject} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {CodeExampleDirective} from '../component-pages/code-example.directive';
import {CodeExamplesMapper} from '../component-pages/code-examples.mapper';
import {CodeExamples} from '../component-pages/code-examples.model';
import {BehaviorSubject, Observable, Subject, combineLatestWith, debounceTime, delay, filter, takeUntil} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {IdPipe} from '../shared/id/id.pipe';
import {TabComponent} from '../component-pages/tabs/tab/tab.component';
import {TabsComponent} from '../component-pages/tabs/tabs.component';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';

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
	readonly componentId = 'component-page';

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

	ngOnInit(): void {
		this.initObservables();
		this.monitorForComponentPageChanges();
		this.monitorForSlugToIdChanges();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private getContentForSelectedSlug(): void {
		const slug: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? '';
		const id: number = this.slugToIdService.getIdForSlug(slug);
		this.getContent(id);
	}

	private getContent(id: number): void {
		this.cmsDataService
			.getComponentPagesComplete(id)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(cmsData => {
				this.title = cmsData.data.name;
				this.apiContentSource.next(cmsData.data.api);
				this.uiUxContentSource.next(cmsData.data.ui_ux);
				this.codeExampleComponentSource.next(CodeExamplesMapper.getCodeExampleComponent(cmsData.data.slug));
			});
	}

	private initObservables(): void {
		this.apiContent$ = this.apiContentSource.asObservable();
		this.codeExampleComponent$ = this.codeExampleComponentSource.asObservable();
		this.uiUxContent$ = this.uiUxContentSource.asObservable();
	}

	private loadCodeExample(codeExampleComponent: Type<CodeExamples> | undefined): void {
		const {viewContainerRef} = this.codeExample;
		viewContainerRef.clear();

		if (codeExampleComponent) {
			viewContainerRef.createComponent<CodeExamples>(codeExampleComponent);
		}
	}

	private monitorForComponentPageChanges(): void {
		this.apiContent$
			.pipe(takeUntil(this.unsubscribe), combineLatestWith(this.codeExampleComponent$, this.uiUxContent$), debounceTime(1))
			.subscribe(next => {
				const apiContent = next[0];
				const codeExampleComponent = next[1];
				const uiUxContent = next[2];

				if (apiContent || codeExampleComponent || uiUxContent) {
					this.loadCodeExample(codeExampleComponent);
					this.tabs.setDefaultTabSelected();
				}
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

	private monitorForSlugToIdChanges(): void {
		this.slugToIdService.readyToMap.pipe(takeUntil(this.unsubscribe), delay(0)).subscribe(() => {
			this.getContentForSelectedSlug();
			this.monitorForNavigationEndEvents();
		});
	}
}
