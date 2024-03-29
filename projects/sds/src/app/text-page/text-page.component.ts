import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject, Subscription, filter} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {CmsDataService} from '../cms/cms-data.service';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-text-page',
	templateUrl: './text-page.component.html',
	styleUrls: ['./text-page.component.scss'],
	standalone: true,
	imports: [CommonModule, IdPipe]
})
export class TextPageComponent implements OnInit, OnDestroy {
	readonly componentId = 'text-page';

	readonly selectedContent$: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>('');

	private readonly subscriptions: Subscription[] = [];

	// eslint-disable-next-line max-params
	constructor(
		private readonly cmsDataService: CmsDataService,
		private readonly slugToIdService: SlugToIdService,
		private readonly domSanitizer: DomSanitizer,
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
			this.cmsDataService
				.getTextPagesComplete(id)
				.subscribe(cmsData => this.selectedContent$.next(this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.description)))
		);
	}
}
