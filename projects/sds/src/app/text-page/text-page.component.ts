import {Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, concatWith, filter, first, map, switchMap} from 'rxjs';
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
export class TextPageComponent {
	readonly componentId = 'text-page';

	readonly selectedContent$: Observable<SafeHtml>;

	// eslint-disable-next-line max-params
	constructor(
		private readonly cmsDataService: CmsDataService,
		private readonly slugToIdService: SlugToIdService,
		private readonly domSanitizer: DomSanitizer,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute
	) {
		this.selectedContent$ = this.slugToIdService.readyToMap.pipe(
			first(),
			concatWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
			map(() => this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
			map(slug => this.slugToIdService.getIdForSlug(slug)),
			switchMap(id => this.cmsDataService.getTextPagesComplete(id)),
			map(cmsData => this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.description))
		);
	}
}
