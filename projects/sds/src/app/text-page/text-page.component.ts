import {Component, inject} from '@angular/core';
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

	constructor() {
		const cmsDataService = inject(CmsDataService);
		const slugToIdService = inject(SlugToIdService);
		const domSanitizer = inject(DomSanitizer);
		const router = inject(Router);
		const activatedRoute = inject(ActivatedRoute);

		this.selectedContent$ = slugToIdService.readyToMap.pipe(
			first(),
			concatWith(router.events.pipe(filter(event => event instanceof NavigationEnd))),
			map(() => activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
			map(slug => slugToIdService.getIdForSlug(slug)),
			switchMap(id => cmsDataService.getTextPagesComplete(id)),
			map(cmsData => domSanitizer.bypassSecurityTrustHtml(cmsData.data.description))
		);
	}
}
