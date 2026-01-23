import {Component, type ElementRef, HostListener, type OnInit, inject, output, viewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, type NavigationExtras, Router} from '@angular/router';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {skip} from 'rxjs/operators';
import {CmsDataService} from '../cms/cms-data.service';
import {
	BehaviorSubject,
	type Observable,
	combineLatestWith,
	debounceTime,
	filter,
	forkJoin,
	map,
	of,
	startWith,
	switchMap,
	tap,
} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {urlConst} from '../shared/url/url.const';
import type {Accordion, Link} from './accordion-links/accordion-links.model';
import {composeAccordions} from './utils/accordion-composer';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonDirective, WINDOW} from '@oblique/oblique';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {VersionComponent} from './version/version.component';
import {ImageComponent} from './image/image.component';
import {VersionService} from '../shared/version/version.service';
import {SlugService} from '../shared/slug/slug.service';
import {FeedbackTriggerDirective} from '../feedback/feedback-trigger.directive';

@Component({
	selector: 'app-side-navigation',
	imports: [
		ImageComponent,
		VersionComponent,
		FormsModule,
		ReactiveFormsModule,
		AccordionLinksComponent,
		CommonModule,
		IdPipe,
		MatFormField,
		MatLabel,
		MatInputModule,
		MatIcon,
		MatPrefix,
		MatButtonModule,
		ObButtonDirective,
		NgOptimizedImage,
		FeedbackTriggerDirective,
	],
	templateUrl: './side-navigation.component.html',
	styleUrl: './side-navigation.component.scss',
})
export class SideNavigationComponent implements OnInit {
	readonly showMobileNavigation = output<boolean>();
	displayMobileNavigation = false;
	readonly componentId = 'side-navigation';
	readonly search = new FormControl('');

	readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

	filteredAccordions$: Observable<Accordion[]>;
	selectedSlug$: Observable<string | undefined>;
	urlParamVersion$: Observable<number | undefined>;

	private readonly version$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly slugService = inject(SlugService);
	private readonly versionService = inject(VersionService);
	private readonly window = inject(WINDOW);
	private readonly collapseBreakpointSize = 905;

	constructor() {
		this.urlParamVersion$ = this.prepareUrlParams();
		this.selectedSlug$ = this.prepareSelectedSlug();
		this.filteredAccordions$ = this.prepareAccordions();
		this.redirectOnVersionChange();
	}

	ngOnInit(): void {
		// this ensures the validity of the page will be tested on initialization
		this.version$.next(13);
	}

	updateVersion(version?: number): void {
		this.version$.next(version);
		this.versionService.setCurrentVersion(version);
	}

	toggleMobileNavigation(): void {
		if (this.isLayoutCollapsed()) {
			this.displayMobileNavigation = !this.displayMobileNavigation;
			this.showMobileNavigation.emit(this.displayMobileNavigation);
		}
	}

	@HostListener('window:keydown', ['$event'])
	moveFocusToSearch($event: KeyboardEvent): void {
		//  On Macintosh keyboards, the metaKey is the ⌘ Command key.
		if (($event.ctrlKey || $event.metaKey) && $event.key === 'k') {
			$event.stopPropagation();
			$event.preventDefault();
			this.searchInput().nativeElement.focus();
		}
	}

	private prepareAccordions(): Observable<Accordion[]> {
		return forkJoin({
			categories: this.cmsDataService.getCategories(),
			tabbedPages: this.cmsDataService.getTabbedPagesShort(),
			textPages: this.cmsDataService.getTextPagesShort(),
		}).pipe(
			map(value => composeAccordions(value)),
			tap(accordions => this.setUpSlugToIdServiceDataSet(accordions)),
			combineLatestWith(this.prepareSearchText(), this.version$, this.urlParamVersion$),
			map(([accordions, searchText, versionId, urlParamVersion]) =>
				this.getAccordionsMatchingSearchTextAndVersion(accordions, searchText, urlParamVersion ?? versionId)
			),
			startWith([])
		);
	}

	private prepareSearchText(): Observable<string> {
		return this.search.valueChanges.pipe(
			debounceTime(300),
			map(searchText => searchText ?? ''),
			startWith('')
		);
	}

	private prepareUrlParams(): Observable<number> {
		return this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(activatedRoute => this.getVersionFromUrlParam(activatedRoute))
		);
	}

	private prepareSelectedSlug(): Observable<string> {
		return this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			startWith(undefined),
			map(() => this.activatedRoute),
			switchMap(activatedRoute => this.getSelectedSlug(activatedRoute))
		);
	}

	private setUpSlugToIdServiceDataSet(accordions: Accordion[]): void {
		const idAndSlugs = new Map<string, number>();

		accordions.forEach(accordion =>
			accordion.links.forEach(link => {
				idAndSlugs.set(link.slug, link.id);
			})
		);

		this.slugToIdService.setupDataSet(idAndSlugs);
	}

	private getAccordionsMatchingSearchText(accordions: Accordion[], searchText?: string): Accordion[] {
		return searchText
			? accordions
					.map(accordion => ({
						...accordion,
						links: accordion.links.filter(link => link.title.toLowerCase().includes(searchText.toLowerCase())),
					}))
					.filter(accordion => accordion.links.length > 0)
			: accordions;
	}

	private getAccordionsMatchingSearchTextAndVersion(
		accordions: Accordion[],
		searchText?: string,
		version?: number
	): Accordion[] {
		return this.getAccordionsMatchingSearchText(accordions, searchText)
			.map(accordion => ({
				...accordion,
				links: this.getNewestLinksForVersion(accordion, version),
			}))
			.filter(accordion => accordion.links.length > 0);
	}

	private getNewestLinksForVersion(accordion: Accordion, version?: number): Link[] {
		return this.getValidLinksForVersion(accordion, version).filter(
			(link, index, validLinks) =>
				!validLinks.some(otherLink => otherLink.slug === link.slug && otherLink.minVersion > link.minVersion)
		);
	}

	private getSelectedSlug(activatedRoute?: ActivatedRoute): Observable<string | undefined> {
		return activatedRoute?.root.firstChild
			? activatedRoute?.root.firstChild.paramMap.pipe(
					map(paramMap => paramMap.get(urlConst.urlParams.selectedSlug) ?? undefined)
				)
			: of(undefined);
	}

	private getValidLinksForVersion(accordion: Accordion, version?: number): Link[] {
		return accordion.links.filter(
			link =>
				(!link.minVersion || link.minVersion <= (version ?? 9999)) &&
				(!link.maxVersion || link.maxVersion >= (version ?? -1))
		);
	}

	private getVersionFromUrlParam(activatedRoute?: ActivatedRoute): number | undefined {
		return Number(activatedRoute.snapshot.queryParamMap.get('version')) || undefined;
	}

	private redirectOnVersionChange(): void {
		this.version$
			.pipe(
				skip(3),
				takeUntilDestroyed(),
				map(version => this.slugService.getNewSlug(version)),
				filter(slug => Boolean(slug))
			)
			.subscribe(slug => {
				const extras: NavigationExtras = {queryParamsHandling: 'preserve', preserveFragment: true};
				if (slug.startsWith('welcome')) {
					void this.router.navigate(['introductions', slug], extras);
				} else {
					void this.router.navigate(['..', slug], {...extras, relativeTo: this.activatedRoute.children[0]});
				}
			});
	}

	private isLayoutCollapsed(): boolean {
		return this.window.matchMedia(`(max-width: ${this.collapseBreakpointSize}px)`).matches;
	}
}
