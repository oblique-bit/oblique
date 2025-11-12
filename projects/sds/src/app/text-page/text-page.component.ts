import {type AfterViewChecked, Component, HostListener, inject} from '@angular/core';
import {DomSanitizer, type SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {type Observable, concatWith, filter, first, map, partition, switchMap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {urlConst} from '../shared/url/url.const';
import {CmsDataService} from '../cms/cms-data.service';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-text-page',
	imports: [CommonModule, IdPipe],
	templateUrl: './text-page.component.html',
	styleUrl: './text-page.component.scss',
	host: {class: 'content-page'},
})
export class TextPageComponent implements AfterViewChecked {
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
			void this.router.navigate(['..', 'invalid']);
		});

		this.selectedContent$ = this.buildSelectedContentObservable(validPageId$);
	}

	ngAfterViewChecked(): void {
		this.handleFragments();
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
				map(() => this.activatedRoute.snapshot.paramMap.get(urlConst.urlParams.selectedSlug) ?? ''),
				map(slug => this.slugToIdService.getIdForSlug(slug))
			),
			id => id !== undefined
		);
	}

	private buildSelectedContentObservable(validPageId$: Observable<number>): Observable<SafeHtml> {
		return validPageId$.pipe(
			switchMap(id => this.cmsDataService.getTextPagesComplete(id)),
			// Sanitation is bypassed because we need IDs and as the HTML comes from the Oblique Team and not anybody
			map(cmsData => this.domSanitizer.bypassSecurityTrustHtml(cmsData.data.description))
		);
	}

	private handleFragments(): void {
		const {fragment} = this.activatedRoute.snapshot;
		if (fragment) {
			const element = document.getElementById(fragment);
			element?.scrollIntoView();
		}
	}
}
