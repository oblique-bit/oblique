import {Component, type OnDestroy, inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
	type ObIAutocompleteInputOption,
	type ObINavigationLink,
	type ObISkipLink,
	ObMasterLayoutHeaderService,
	WINDOW,
} from '@oblique/oblique';
import {appVersion} from '@oblique/version';
import {type Observable, Subject} from 'rxjs';
import {delay, filter, map, startWith, takeUntil} from 'rxjs/operators';
import {DynamicNavigationService} from './samples/master-layout/dynamic-navigation.service';
import {appNavigation} from './app-navigation';

@Component({
	selector: 'sb-root',
	standalone: false,
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
	version = appVersion;
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
		{
			url: '../samples/file-upload',
			fragment: 'fantasy',
			label: 'Example to demo console message for a non existing element.',
		},
	];
	autocompleteItems$: Observable<ObIAutocompleteInputOption[]>;
	readonly nav = inject(DynamicNavigationService);
	private readonly unsubscribe = new Subject<void>();
	private readonly router = inject(Router);
	private readonly translate = inject(TranslateService);

	constructor() {
		const header = inject(ObMasterLayoutHeaderService);
		const window = inject<Window>(WINDOW);

		this.initializeSearch();
		this.nav.setNavigation(this.navigation);
		this.nav.navigationLinks$.subscribe(links => {
			this.navigation = links;
		});
		this.router.events
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
				filter(item => Boolean(item)),
				delay(1) // let the current value by processed before resetting it
			)
			.subscribe(item => {
				this.search.reset('');
				const language = this.translate.getCurrentLang();
				void this.router.navigateByUrl(`/${language}/${item.url}`);
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
						url: `${link.url}/${child.url}`,
					})),
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
			startWith(this.translate.getCurrentLang()),
			map(() => autocompleteItems.map(item => ({...item, label: this.translate.instant(item.label)})))
		);
	}
}
