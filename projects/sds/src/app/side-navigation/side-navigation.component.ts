import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, NavigationExtras, Router} from '@angular/router';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {skip} from 'rxjs/operators';
import {CmsDataService} from '../cms/cms-data.service';
import {BehaviorSubject, Observable, combineLatestWith, debounceTime, filter, forkJoin, map, of, startWith, switchMap, tap} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {Accordion, Link} from './accordion-links/accordion-links.model';
import {AccordionComposer} from './utils/accordion-composer';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {VersionComponent} from './version/version.component';
import {ImageComponent} from './image/image.component';
import {VersionService} from '../shared/version/version.service';

@Component({
	selector: 'app-side-navigation',
	templateUrl: './side-navigation.component.html',
	styleUrls: ['./side-navigation.component.scss'],
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
		MatPrefix
	]
})
export class SideNavigationComponent implements OnInit {
	@Output() readonly showMobileNavigation = new EventEmitter<boolean>();
	displayMobileNavigation = false;
	readonly componentId = 'side-navigation';
	readonly search = new FormControl('');

	@ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

	filteredAccordions$: Observable<Accordion[]>;
	selectedSlug$: Observable<string | undefined>;
	urlParamVersion$: Observable<number | undefined>;

	private readonly version$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);
	private readonly versionService = inject(VersionService);

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
		this.displayMobileNavigation = !this.displayMobileNavigation;
		this.showMobileNavigation.emit(this.displayMobileNavigation);
	}

	@HostListener('window:keydown', ['$event'])
	moveFocusToSearch($event: KeyboardEvent): void {
		//  On Macintosh keyboards, the metaKey is the ⌘ Command key.
		if (($event.ctrlKey || $event.metaKey) && $event.key === 'k') {
			$event.stopPropagation();
			$event.preventDefault();
			this.searchInput.nativeElement.focus();
		}
	}

	private prepareAccordions(): Observable<Accordion[]> {
		return forkJoin({
			categories: this.cmsDataService.getCategories(),
			tabbedPages: this.cmsDataService.getTabbedPagesShort(),
			textPages: this.cmsDataService.getTextPagesShort()
		}).pipe(
			map(value => AccordionComposer.composeAccordions(value)),
			tap(accordions => this.setUpSlugToIdServiceDataSet(accordions)),
			combineLatestWith(this.prepareSearchText(), this.version$, this.urlParamVersion$),
			map(([accordions, searchText, versionId, urlParamVersion]) =>
				this.getAccordionsMatchingSearchTextAndVersion(accordions, searchText, versionId, urlParamVersion)
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

		accordions.forEach(accordion => accordion.links.forEach(link => idAndSlugs.set(link.slug, link.id)));

		this.slugToIdService.setupDataSet(idAndSlugs);
	}

	private getAccordionsMatchingSearchText(accordions: Accordion[], searchText?: string): Accordion[] {
		return searchText
			? accordions
					.map(accordion => ({
						...accordion,
						links: accordion.links.filter(link => link.title.toLowerCase().includes(searchText.toLowerCase()))
					}))
					.filter(accordion => accordion.links.length > 0)
			: accordions;
	}

	private getAccordionsMatchingSearchTextAndVersion(
		accordions: Accordion[],
		searchText?: string,
		dropDownVersion?: number,
		urlParamVersion?: number
	): Accordion[] {
		return this.getAccordionsMatchingSearchText(accordions, searchText)
			.map(accordion => ({
				...accordion,
				links: this.getNewestLinksForVersion(accordion, urlParamVersion ?? dropDownVersion)
			}))
			.filter(accordion => accordion.links.length > 0);
	}

	private getNewestLinksForVersion(accordion: Accordion, version?: number): Link[] {
		return this.getValidLinksForVersion(accordion, version).filter(
			(link, _i, validLinks) => !validLinks.some(otherLink => otherLink.slug === link.slug && otherLink.minVersion > link.minVersion)
		);
	}

	private getSelectedSlug(activatedRoute?: ActivatedRoute): Observable<string | undefined> {
		return activatedRoute?.root.firstChild
			? activatedRoute?.root.firstChild.paramMap.pipe(map(paramMap => paramMap.get(URL_CONST.urlParams.selectedSlug) ?? undefined))
			: of(undefined);
	}

	private getValidLinksForVersion(accordion: Accordion, version?: number): Link[] {
		return accordion.links.filter(
			link => (!link.minVersion || link.minVersion <= (version ?? 9999)) && (!link.maxVersion || link.maxVersion >= (version ?? -1))
		);
	}

	private getVersionFromUrlParam(activatedRoute?: ActivatedRoute): number | undefined {
		return +activatedRoute.snapshot.queryParamMap.get('version') || undefined;
	}

	private getCurrentSlug(): string {
		return this.router.url
			.replace(/[#|?].*/, '') // remove queryParams & fragment
			.replace(/\/(?:api|ui_ux|examples)/, '')
			.split('/')
			.pop();
	}

	private redirectOnVersionChange(): void {
		this.version$
			.pipe(
				skip(3),
				takeUntilDestroyed(),
				map(version => this.getNewSlug(version, this.getCurrentSlug())),
				filter(slug => !!slug)
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

	private getNewSlug(version: number, slug: string): string | undefined {
		switch (version) {
			case 10:
				return 'welcome-10';
			case 11:
				return this.redirectVersion11(slug);
			case 12:
				return this.redirectVersion12(slug);
			case 13:
				return this.redirectVersion13(slug);
			default:
				return undefined;
		}
	}

	private redirectVersion11(slug: string): string | undefined {
		switch (slug) {
			case 'welcome-10':
				return 'welcome';
			case 'configuration-12':
				return 'configuration';
			case 'master-layout-12':
			case 'master-layout-13':
				return 'master-layout';
			case 'popover-12':
				return 'popover';
			case 'shadow':
			case 'getting-started-figma':
			case 'getting-started-as-a-designer':
				return 'invalid';
			default:
				return undefined;
		}
	}

	private redirectVersion12(slug: string): string | undefined {
		switch (slug) {
			case 'welcome-10':
				return 'welcome';
			case 'configuration':
				return 'configuration-12';
			case 'master-layout':
			case 'master-layout-13':
				return 'master-layout-12';
			case 'popover':
				return 'popover-12';
			case 'language':
			case 'datepicker':
			case 'getting-started-figma':
			case 'getting-started-as-a-designer':
				return 'invalid';
			default:
				return undefined;
		}
	}

	private redirectVersion13(slug: string): string | undefined {
		switch (slug) {
			case 'welcome-10':
				return 'welcome';
			case 'configuration':
				return 'configuration-12';
			case 'master-layout':
			case 'master-layout-12':
				return 'master-layout-13';
			case 'popover':
				return 'popover-12';
			case 'language':
			case 'datepicker':
				return 'invalid';
			default:
				return undefined;
		}
	}
}
