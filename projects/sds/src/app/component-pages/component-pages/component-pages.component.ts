import {Component, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../../cms/cms-data.service';
import {CodeExampleDirective} from '../code-example.directive';
import {CodeExamplesMapper} from '../code-examples/code-examples.mapper';
import {CodeExamples} from '../code-examples/code-examples.model';
import {NoCodeExamplesMatchComponent} from '../code-examples/no-match/no-code-examples-match.component';
import {BehaviorSubject, Subscription, filter} from 'rxjs';
import {SlugToIdService} from '../../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../../shared/url/url.const';

@Component({
	selector: 'app-component-pages',
	templateUrl: './component-pages.component.html',
	styleUrls: ['./component-pages.component.scss']
})
export class ComponentPagesComponent implements OnInit, OnDestroy {
	@ViewChild(CodeExampleDirective, {static: true}) codeExample!: CodeExampleDirective;
	readonly componentId = 'component-page';

	readonly apiContent$: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>('');
	readonly uiUxContent$: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>('');

	private readonly subscriptions: Subscription[] = [];

	// eslint-disable-next-line max-params
	constructor(
		private readonly cmsDataService: CmsDataService,
		private readonly domSanitizer: DomSanitizer,
		private readonly slugToIdService: SlugToIdService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.subscriptions.push(
			this.slugToIdService.readyToMap.subscribe(() => {
				this.getContentForSelectedSlug();
				this.reactToNavigationEnd();
			})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	private reactToNavigationEnd(): void {
		this.subscriptions.push(
			this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
				this.getContentForSelectedSlug();
			})
		);
	}

	private getContentForSelectedSlug(): void {
		const slug: string = this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? '';
		const id: number = this.slugToIdService.getIdForSlug(slug);
		this.getContent(id);
	}

	private getContent(id: number): void {
		this.subscriptions.push(
			this.cmsDataService.getComponentPagesComplete(id).subscribe(cmsData => {
				this.uiUxContent$.next(this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.ui_ux));
				this.apiContent$.next(this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.api));
				this.loadCodeExample(cmsData.data.slug);
			})
		);
	}

	private loadCodeExample(slug: string): void {
		const {viewContainerRef} = this.codeExample;
		viewContainerRef.clear();

		const codeExampleComponent: Type<CodeExamples> = CodeExamplesMapper.getCodeExampleComponent(slug);

		if (codeExampleComponent) {
			viewContainerRef.createComponent<CodeExamples>(codeExampleComponent);
		} else {
			viewContainerRef.createComponent<CodeExamples>(NoCodeExamplesMatchComponent);
		}
	}
}
