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
	selector: 'sb-root',
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
				{
					url: 'alert',
					label: 'Alert',
					children: [
						{
							url: '1',
							label: 'Alert 1',
							children: [
								{
									url: '1',
									label: 'Alert 1.1',
									children: [
										{
											url: '1',
											label: 'Alert 1.1.1',
											children: [
												{url: '1', label: 'Alert 1.1.1.1'},
												{url: '2', label: 'Alert 1.1.1.2'},
												{url: '3', label: 'Alert 1.1.1.3'}
											]
										},
										{url: '2', label: 'Alert 1.1.2'},
										{url: '3', label: 'Alert 1.1.3'}
									]
								},
								{url: '2', label: 'Alert 1.2'},
								{url: '3', label: 'Alert 1.3'}
							]
						},
						{url: '2', label: 'Alert 2'},
						{url: '3', label: 'Alert 3'}
					]
				},
				{url: 'autocomplete', label: 'Autocomplete'},
				{url: 'button', label: 'Buttons'},
				{url: 'breadcrumb', label: 'Breadcrumb'},
				{
					url: 'collapse',
					label: 'Collapse',
					children: [
						{url: '1', label: 'Collapse 1'},
						{url: '2', label: 'Collapse 2'},
						{url: '3', label: 'Collapse 3'},
						{url: '4', label: 'Collapse 4'},
						{url: '5', label: 'Collapse 5'},
						{url: '6', label: 'Collapse 6'},
						{url: '7', label: 'Collapse 7'},
						{url: '8', label: 'Collapse 8'},
						{url: '9', label: 'Collapse 9'},
						{url: '10', label: 'Collapse 10'},
						{url: '11', label: 'Collapse 11'},
						{url: '12', label: 'Collapse 12'},
						{url: '13', label: 'Collapse 13'},
						{url: '14', label: 'Collapse 14'},
						{url: '15', label: 'Collapse 15'},
						{url: '16', label: 'Collapse 16'},
						{url: '17', label: 'Collapse 17'},
						{url: '18', label: 'Collapse 18'},
						{url: '19', label: 'Collapse 19'},
						{url: '20', label: 'Collapse 20'}
					]
				},
				{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: 'column-layout-full-height', label: 'Column layout full height'},
				{url: 'error-messages', label: 'Error messages'},
				{url: 'external-link', label: 'External-link'},
				{url: 'file-upload', label: 'File Upload'},
				{url: 'form', label: 'Forms', children: [{url: '1', label: 'Forms 1'}]},
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
				{
					url: 'spinner',
					label: 'Spinner',
					children: [
						{url: '1', label: 'Spinner 1'},
						{url: '2', label: 'Spinner 2'},
						{url: '3', label: 'Spinner 3'},
						{url: '4', label: 'Spinner 4'},
						{url: '5', label: 'Spinner 5'}
					]
				},
				{url: 'sticky', label: 'Sticky'},
				{url: 'unknown-route-sample', label: 'Unknown route'},
				{url: 'unsaved-changes', label: 'Unsaved changes'}
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
				{url: 'datepicker', label: 'Datepicker'},
				{url: 'dialog', label: 'Dialog'},
				{url: 'expansion-panel', label: 'Expansion Panel'},
				{url: 'file-upload', label: 'File Upload'},
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
		},
		{url: 'http://www.google.ch', label: 'About Us', isExternal: true, startOfRightSideLinks: true},
		{url: 'http://www.google.ch', label: 'Contact', isExternal: true}
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
