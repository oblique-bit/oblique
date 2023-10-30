import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../cms/cms-data.service';
import {BehaviorSubject, Observable, Subscription, combineLatestWith, debounceTime, filter, forkJoin, map, of, switchMap, take} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
import {Logo} from './side-navigation.model';
import {Accordion, Link} from './accordion-links/accordion-links.model';
import {AccordionComposer} from './utils/accordion-composer';
import {IdPipe} from '../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {VersionComponent} from './version/version.component';
import {ImageComponent} from './image/image.component';

@Component({
	selector: 'app-side-navigation',
	templateUrl: './side-navigation.component.html',
	styleUrls: ['./side-navigation.component.scss'],
	standalone: true,
	imports: [ImageComponent, VersionComponent, FormsModule, ReactiveFormsModule, AccordionLinksComponent, CommonModule, IdPipe]
})
export class SideNavigationComponent implements OnInit, OnDestroy {
	readonly componentId = 'side-navigation';

	readonly logo: Logo = {
		alt: 'Swiss Confederation Logo',
		maxHeight: 'string',
		maxWidth: 'string',
		src: '../assets/images/SwissConfederationLogo.svg'
	};

	search = new FormControl('');

	filteredAccordions$: BehaviorSubject<Accordion[]> = new BehaviorSubject<Accordion[]>([]);
	searchText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	selectedSlug$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
	version$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

	private readonly accordions$: BehaviorSubject<Accordion[]> = new BehaviorSubject<Accordion[]>([]);
	private readonly subscriptions: Subscription[] = [];

	// eslint-disable-next-line max-params
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly cmsDataService: CmsDataService,
		private readonly router: Router,
		private readonly slugToIdService: SlugToIdService
	) {}

	ngOnInit(): void {
		this.prepareAccordions();

		this.subscriptions.push(
			this.getSelectedSlug(this.activatedRoute)
				.pipe(take(1))
				.subscribe(selectedSlug => this.selectedSlug$.next(selectedSlug)),
			this.router.events
				.pipe(
					filter(event => event instanceof NavigationEnd),
					map(() => this.activatedRoute),
					switchMap(activatedRoute => this.getSelectedSlug(activatedRoute))
				)
				.subscribe(selectedSlug => {
					this.selectedSlug$.next(selectedSlug);
				}),
			this.accordions$
				.pipe(combineLatestWith(this.searchText$, this.version$))
				.subscribe(([accordions, searchText, versionId]) =>
					this.filteredAccordions$.next(this.getAccordionsMatchingSearchTextAndVersion(accordions, searchText, versionId))
				),
			this.search.valueChanges.pipe(debounceTime(300)).subscribe(searchText => {
				this.searchText$.next(searchText ?? '');
			})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	updateVersion(version?: number): void {
		this.version$.next(version);
	}

	private prepareAccordions(): void {
		this.subscriptions.push(
			forkJoin({
				categories: this.cmsDataService.getCategories(),
				tabbedPages: this.cmsDataService.getTabbedPagesShort(),
				textPages: this.cmsDataService.getTextPagesShort()
			})
				.pipe(map(value => AccordionComposer.composeAccordions(value)))
				.subscribe(accordions => {
					this.accordions$.next(accordions);
					this.setUpSlugToIdServiceDataSet(accordions);
				})
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

	private getAccordionsMatchingSearchTextAndVersion(accordions: Accordion[], searchText?: string, version?: number): Accordion[] {
		return this.getAccordionsMatchingSearchText(accordions, searchText)
			.map(accordion => ({
				...accordion,
				links: this.getNewestLinksForVersion(accordion, version)
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
}
