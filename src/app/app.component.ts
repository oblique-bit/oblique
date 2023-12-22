import {Component, Inject, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ObEIcon, ObIAutocompleteInputOption, ObINavigationLink, ObISkipLink, ObMasterLayoutHeaderService, WINDOW} from '@oblique/oblique';
import {Observable, Subject} from 'rxjs';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {DynamicNavigationService} from './samples/master-layout/dynamic-navigation.service';
import {FONTS, FontService} from './common/font.service';

@Component({
	selector: 'sc-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
	readonly search = new FormControl();
	offCanvasOpen = false;
	font$: Observable<string>;
	readonly year = new Date().getFullYear();
	navigation: ObINavigationLink[] = [
		{
			url: 'home',
			label: 'i18n.routes.home.title',
			icon: ObEIcon.HOME,
			iconOnly: true,
			fragment: 'test',
			queryParams: {param1: 'a', param2: 'b'}
		},
		{url: 'http://www.google.ch', label: 'Google', icon: ObEIcon.SEARCH},
		{url: 'http://www.google.ch', label: 'Google sameTarget', sameTarget: true},
		{
			url: 'samples',
			label: 'i18n.routes.samples.title',
			icon: ObEIcon.BOOKMARK,
			children: [
				{url: 'alert', label: 'Alert'},
				{url: 'autocomplete', label: 'Autocomplete'},
				{url: 'button', label: 'Buttons'},
				{url: 'breadcrumb', label: 'Breadcrumb'},
				{url: 'collapse', label: 'Collapse'},
				{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: 'column-layout-full-height', label: 'Column layout full height'},
				{url: 'error-messages', label: 'Error messages'},
				{url: 'external-link', label: 'External-link'},
				{url: 'file-upload', label: 'File Upload'},
				{url: 'global-events', label: 'Global events'},
				{url: 'horizontal-forms', label: 'Horizontal Forms'},
				{url: 'http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: 'input-clear', label: 'Input clear'},
				{url: 'language', label: 'Language'},
				{url: 'master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: 'multi-translate-loader', label: 'Multi translate loader'},
				{url: 'nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: 'nested-form', label: 'Nested froms'},
				{url: 'notification', label: 'i18n.routes.samples.notification.title'},
				{url: 'number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: 'pop-up', label: 'Pop-up'},
				{url: 'popover', label: 'Popover'},
				{url: 'schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: 'selectable', label: 'Selectable'},
				{url: 'service-navigation', label: 'Service navigation'},
				{url: 'spinner', label: 'Spinner'},
				{url: 'sticky', label: 'Sticky'},
				{url: 'unknown-route-sample', label: 'Unknown route'},
				{url: 'unsaved-changes', label: 'Unsaved changes'},
				{url: 'form', label: 'Forms'}
			]
		},
		{
			url: 'styles',
			label: 'Styles',
			children: [
				{url: 'typography', label: 'Typography'},
				{url: 'block', label: 'Block elements'},
				{url: 'grid', label: 'Grid system'},
				{url: 'icon', label: 'Icons as class'},
				{url: 'inline', label: 'Inline elements'},
				{url: 'lists', label: 'Lists'},
				{url: 'table', label: 'HTML table'},
				{url: 'stepper', label: 'HTML Stepper'},
				{url: 'tabs', label: 'HTML tabs'},
				{url: 'alert', label: 'Alert'},
				{url: 'palette', label: 'Palette'},
				{url: 'screen-reader-only', label: 'Screen reader only'}
			]
		},
		{
			url: 'material',
			label: 'Material',
			children: [
				{url: 'badge', label: 'Badge'},
				{url: 'button', label: 'Button'},
				{url: 'card', label: 'Card'},
				{url: 'chips', label: 'Chips'},
				{url: 'dialog', label: 'Dialog'},
				{url: 'expansion-panel', label: 'Expansion Panel'},
				{url: 'form', label: 'Forms'},
				{url: 'icon', label: 'Icons'},
				{url: 'list', label: 'List'},
				{url: 'mandatory', label: 'Mandatory'},
				{url: 'progress-bar', label: 'Progress bar'},
				{url: 'slider', label: 'Slider'},
				{url: 'stepper-horizontal', label: 'Stepper horizontal'},
				{url: 'stepper-vertical', label: 'Stepper vertical'},
				{url: 'table', label: 'Table'},
				{url: 'tabs', label: 'Tabs'},
				{url: 'tooltip', label: 'Tooltip'}
			]
		},
		{
			url: 'icon sample',
			label: 'Icon samples',
			icon: ObEIcon.APPS,
			iconOnly: true,
			children: [
				{url: 'home', icon: ObEIcon.ALD, label: 'Icon with label'},
				{url: 'home', label: 'Label only'},
				{url: 'home', label: 'icon only', icon: ObEIcon.ANCHOR, iconOnly: true},
				{url: 'http://www.google.ch', icon: ObEIcon.ALD, label: 'External, icon with label'},
				{url: 'http://www.google.ch', label: 'External, label only'},
				{url: 'http://www.google.ch', label: 'External, icon only', icon: ObEIcon.ANCHOR, iconOnly: true}
			]
		}
	];
	skipLinks: ObISkipLink[] = [
		{url: 'current', fragment: 'fragment', label: 'i18n.application.skiplinks.custom'},
		{url: 'current', label: 'Skip to current without fragment'},
		{url: '../samples', fragment: 'fragment', label: 'Skip to samples with fragment'},
		{url: '../samples', label: 'Skip to samples without fragment'}
	];
	autocompleteItems$: Observable<ObIAutocompleteInputOption[]>;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly font: FontService,
		nav: DynamicNavigationService,
		private readonly router: Router,
		private readonly translate: TranslateService,
		private readonly header: ObMasterLayoutHeaderService,
		@Inject(WINDOW) window: Window
	) {
		this.initializeSearch();
		this.font$ = this.font.font$;
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

	toggleFont(font: string): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		this.font.setFont(font === FONTS.FRUTIGER ? FONTS.ROBOTO : FONTS.FRUTIGER);
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
