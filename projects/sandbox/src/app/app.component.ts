import {Component, Inject, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ObIAutocompleteInputOption, ObINavigationLink, ObISkipLink, ObMasterLayoutHeaderService, WINDOW} from '@oblique/oblique';
import {Observable, Subject} from 'rxjs';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {DynamicNavigationService} from './samples/master-layout/dynamic-navigation.service';
import {appNavigation} from './app-navigation';

@Component({
	selector: 'sb-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	standalone: false
})
export class AppComponent implements OnDestroy {
	readonly search = new FormControl();
	offCanvasOpen = false;
	readonly year = new Date().getFullYear();
	navigation: ObINavigationLink[] = appNavigation;
	skipLinks: ObISkipLink[] = [
		{url: 'current', fragment: 'fragment', label: 'i18n.application.skiplinks.custom'},
		{url: 'current', label: 'Skip to current without fragment'},
		{url: '../samples', fragment: 'fragment', label: 'Skip to samples with fragment'},
		{url: '../samples', label: 'Skip to samples without fragment'},
		{url: 'current', fragment: 'link-to-blick-ch', label: 'Skip to "Blick" link in the footer'},
		{url: '../samples/file-upload', fragment: 'fantasy', label: 'Example to demo console message for a non existing element.'},
		{url: '../samples/file-upload', fragment: 'acceptFiles', label: 'Example to demo console message for a non focusable element.'},
		{
			url: 'current',
			fragment: 'link-to-google-ch',
			label:
				'Example to demo console message for an element existing and focusable (footer link to google), but not whitelisted in ObMasterLayoutConfig.focusableFragments.'
		}
	];
	autocompleteItems$: Observable<ObIAutocompleteInputOption[]>;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		public nav: DynamicNavigationService,
		private readonly router: Router,
		private readonly translate: TranslateService,
		private readonly header: ObMasterLayoutHeaderService,
		@Inject(WINDOW) window: Window
	) {
		this.initializeSearch();
		nav.setNavigation(this.navigation);
		nav.navigationLinks$.subscribe(links => {
			this.navigation = links;
		});
		router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => (header.serviceNavigationConfiguration.returnUrl = window.location.href));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	updateNavigation(navigation: ObINavigationLink[]): void {
		this.nav.setNavigation(navigation);
	}

	private initializeSearch(): void {
		const searchItems = this.getChildNavigationLinks(this.navigation);
		this.autocompleteItems$ = this.buildAutocompleteItemsObservable(searchItems);
		this.search.valueChanges
			.pipe(
				takeUntil(this.unsubscribe),
				map(value => searchItems.find(item => this.translate.instant(item.label) === value)),
				filter(item => !!item)
			)
			.subscribe(item => {
				this.search.reset('');
				void this.router.navigate([item.url]);
			});
	}

	private getChildNavigationLinks(items: ObINavigationLink[]): ObINavigationLink[] {
		return items
			.filter(item => item.children)
			.filter(item => item.url !== 'icon sample')
			.reduce<ObINavigationLink[]>(
				(links, link) => [
					...links,
					...link.children.map(child => ({
						...child,
						url: `${link.url}/${child.url}`
					}))
				],
				[]
			);
	}

	private buildAutocompleteItemsObservable(items: ObINavigationLink[]): Observable<ObIAutocompleteInputOption[]> {
		const autocompleteItems = items.reduce<ObIAutocompleteInputOption[]>(
			(options, current) => [...options, {label: current.label, disabled: false}],
			[]
		);
		return this.translate.onLangChange.pipe(
			startWith(this.translate.currentLang),
			map(() => autocompleteItems.map(item => ({...item, label: this.translate.instant(item.label)})))
		);
	}
}
