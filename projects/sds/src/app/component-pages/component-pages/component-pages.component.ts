import {Component, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {CmsDataService} from '../../cms/cms-data.service';
import {CodeExampleDirective} from '../code-example.directive';
import {CodeExamplesMapper} from '../code-examples.mapper';
import {CodeExamples} from '../code-examples.model';
import {NoCodeExamplesMatchComponent} from '../no-match/no-code-examples-match.component';
import {BehaviorSubject, Subscription, filter} from 'rxjs';
import {SlugToIdService} from '../../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../../shared/url/url.const';
import {IdPipe} from '../../shared/id/id.pipe';
import {TabComponent} from '../tabs/tab/tab.component';
import {TabsComponent} from '../tabs/tabs.component';
import {AlertCodeExamplesComponent} from '../code-examples/alert/alert-code-examples.component';
import {BadgeCodeExamplesComponent} from '../code-examples/badge/badge-code-examples.component';
import {AlertExampleSuccessPreviewComponent} from '../code-examples/alert/previews/success/alert-example-success-preview.component';
import {AlertExampleInfoPreviewComponent} from '../code-examples/alert/previews/info/alert-example-info-preview.component';
import {BadgeExamplePositionBelowBeforeComponent} from '../code-examples/badge/previews/badge-example-position-below-before/badge-example-position-below-before.component';
import {ButtonExamplePrimaryLoginDisabledComponent} from '../code-examples/button/previews/primary-login-disabled/button-example-primary-login-disabled.component';
import {DialogCodeExamplesComponent} from '../code-examples/dialog/dialog-code-examples.component';
import {PaginatorCodeExamplesComponent} from '../code-examples/paginator/paginator-code-examples.component';
import {ButtonCodeExamplesComponent} from '../code-examples/button/button-code-examples.component';
import {BannerCodeExamplesComponent} from '../code-examples/banner/banner-code-examples.component';
import {CodeExampleComponent} from '../code-example/code-example.component';
import {ButtonExamplePrimaryLinkFrownComponent} from '../code-examples/button/previews/primary-link-frown/button-example-primary-link-frown.component';
import {BadgeExampleColorWarnComponent} from '../code-examples/badge/previews/badge-example-color-warn/badge-example-color-warn.component';
import {ButtonExampleTertiaryRepeatNoTextComponent} from '../code-examples/button/previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component';
import {DatepickerCodeExamplesComponent} from '../code-examples/datepicker/datepicker-code-examples.component';
import {ButtonExampleSecondaryWheelchairComponent} from '../code-examples/button/previews/secondary-wheelchair/button-example-secondary-wheelchair.component';
import {ListGroupCodeExamplesComponent} from '../code-examples/list-group/list-group-code-examples.component';
import {BadgeExampleOverlapFalseComponent} from '../code-examples/badge/previews/badge-example-overlap-false/badge-example-overlap-false.component';
import {BadgeExampleDefaultComponent} from '../code-examples/badge/previews/badge-example-default/badge-example-default.component';
import {ButtonExampleSecondaryLinkNoIconComponent} from '../code-examples/button/previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component';
import {HighlightedCodeComponent} from '../code-example/highlighted-code/highlighted-code.component';
import {ButtonExampleTertiaryLinkNoIconDisabledComponent} from '../code-examples/button/previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component';
import {ObAlertModule, ObButtonModule} from '@oblique/oblique';
import {MatListModule} from '@angular/material/list';
import {MatLineModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
	selector: 'app-component-pages',
	templateUrl: './component-pages.component.html',
	styleUrls: ['./component-pages.component.scss'],
	standalone: true,
	imports: [
		TabsComponent,
		TabComponent,
		CodeExampleDirective,
		AsyncPipe,
		IdPipe,
		AlertCodeExamplesComponent,
		AlertExampleInfoPreviewComponent,
		AlertExampleSuccessPreviewComponent,
		BadgeCodeExamplesComponent,
		BadgeExampleColorWarnComponent,
		BadgeExampleDefaultComponent,
		BadgeExampleOverlapFalseComponent,
		BadgeExamplePositionBelowBeforeComponent,
		BannerCodeExamplesComponent,
		ButtonCodeExamplesComponent,
		ButtonExamplePrimaryLinkFrownComponent,
		ButtonExamplePrimaryLoginDisabledComponent,
		ButtonExampleSecondaryLinkNoIconComponent,
		ButtonExampleSecondaryWheelchairComponent,
		ButtonExampleTertiaryLinkNoIconDisabledComponent,
		ButtonExampleTertiaryRepeatNoTextComponent,
		CodeExampleComponent,
		CodeExampleDirective,
		DatepickerCodeExamplesComponent,
		DialogCodeExamplesComponent,
		HighlightedCodeComponent,
		ListGroupCodeExamplesComponent,
		NoCodeExamplesMatchComponent,
		PaginatorCodeExamplesComponent,
		TabComponent,
		TabsComponent,
		MatBadgeModule,
		MatButtonModule,
		MatIconModule,
		MatLineModule,
		MatListModule,
		ObAlertModule,
		ObButtonModule
	]
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
