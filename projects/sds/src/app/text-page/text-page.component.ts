import {Component, HostListener, inject} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, concatWith, filter, first, map, partition, switchMap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {CmsDataService} from '../cms/cms-data.service';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
	private readonly cmsDataService = inject(CmsDataService);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly domSanitizer = inject(DomSanitizer);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);

	constructor() {
		const [validPageId$, invalidPageId$] = this.buildPageIdObservables();
		invalidPageId$.pipe(takeUntilDestroyed()).subscribe(() => {
			void this.router.navigate(['introductions', 'welcome']);
		});

		this.selectedContent$ = this.buildSelectedContentObservable(validPageId$);
	}

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent): void {
		const {target} = event;
		if (!(target instanceof HTMLAnchorElement && target.target !== '_blank')) {
			return;
		}
		event.preventDefault();
		if (target.hash) {
			const fragment = target.hash.replace('#', '');
			void this.router.navigate([target.pathname], {fragment});
		} else {
			void this.router.navigate([target.pathname]);
		}
	}

	private buildPageIdObservables(): [Observable<number>, Observable<number>] {
		return partition(
			this.slugToIdService.readyToMap.pipe(
				first(),
				concatWith(this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
				map(() => this.activatedRoute.snapshot.paramMap.get(URL_CONST.urlParams.selectedSlug) ?? ''),
				map(slug => this.slugToIdService.getIdForSlug(slug))
			),
			id => id !== undefined
		);
	}

	private buildSelectedContentObservable(validPageId$: Observable<number>): Observable<SafeHtml> {
		return validPageId$.pipe(
			switchMap(id => this.cmsDataService.getTextPagesComplete(id)),
			map(cmsData => this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.description))
		);
	}
}
