import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {CmsDataService} from '../cms/cms-data.service';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	combineLatestWith,
	debounceTime,
	filter,
	forkJoin,
	map,
	of,
	startWith,
	switchMap,
	take,
	tap
} from 'rxjs';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {URL_CONST} from '../shared/url/url.const';
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
		MatInput,
		MatIcon,
		MatPrefix
	]
})
export class SideNavigationComponent implements OnInit, OnDestroy {
	readonly componentId = 'side-navigation';

	search = new FormControl('');

	filteredAccordions$: Observable<Accordion[]>;
	searchText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	selectedSlug$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
	version$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
	urlParamVersion$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

	private readonly subscriptions: Subscription[] = [];
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly cmsDataService = inject(CmsDataService);
	private readonly router = inject(Router);
	private readonly slugToIdService = inject(SlugToIdService);

	constructor() {
		this.filteredAccordions$ = this.prepareAccordions();
	}

	ngOnInit(): void {
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
			this.search.valueChanges.pipe(debounceTime(300)).subscribe(searchText => {
				this.searchText$.next(searchText ?? '');
			}),
			this.router.events
				.pipe(
					filter(event => event instanceof NavigationEnd),
					map(() => this.activatedRoute)
				)
				.subscribe(activatedRoute => {
					this.urlParamVersion$.next(this.getVersionFromUrlParam(activatedRoute));
				})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	updateVersion(version?: number): void {
		this.version$.next(version);
	}

	private prepareAccordions(): Observable<Accordion[]> {
		return forkJoin({
			categories: this.cmsDataService.getCategories(),
			tabbedPages: this.cmsDataService.getTabbedPagesShort(),
			textPages: this.cmsDataService.getTextPagesShort()
		}).pipe(
			map(value => AccordionComposer.composeAccordions(value)),
			tap(accordions => this.setUpSlugToIdServiceDataSet(accordions)),
			combineLatestWith(this.searchText$, this.version$, this.urlParamVersion$),
			map(([accordions, searchText, versionId, urlParamVersion]) =>
				this.getAccordionsMatchingSearchTextAndVersion(accordions, searchText, versionId, urlParamVersion)
			),
			startWith([])
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
}
