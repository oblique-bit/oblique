import {Component} from '@angular/core';
import {FONTS, ObINavigationLink, ObISearchWidgetItem, THEMES, ObThemeService} from 'oblique';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`.fa-sign-in-alt {
        transition: transform 600ms;
    }`]
})
export class AppComponent {
	offCanvasOpen = false;
	theme$: Observable<string>;
	font$: Observable<string>;
	navigation: ObINavigationLink[] = [
		{url: 'home', label: 'i18n.routes.home.title'},
		{
			url: 'samples', label: 'i18n.routes.samples.title', children: [
				{url: 'collapse', label: 'Collapse'},
				{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: 'datepicker', label: 'i18n.routes.samples.datepicker.title'},
				{url: 'error-messages', label: 'Error messages'},
				{url: 'filter-box', label: 'i18n.routes.samples.filter-box.title'},
				{url: 'form-control-state', label: 'i18n.routes.samples.form-control-state.title'},
				{url: 'http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: 'master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: 'multi-translate-loader', label: 'Multi translate loader'},
				{url: 'multiselect', label: 'i18n.routes.samples.multiselect.title'},
				{url: 'nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: 'navigable', label: 'i18n.routes.samples.navigable.title'},
				{url: 'nested-form', label: 'Nested froms'},
				{url: 'notification', label: 'i18n.routes.samples.notification.title'},
				{url: 'number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: 'pop-up', label: 'Pop-up'},
				{url: 'schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: 'selectable', 'label': 'Selectable'},
				{url: 'sticky', label: 'Sticky'},
				{url: 'unknown-route-sample', label: 'Unknown route'},
				{url: 'unsaved-changes', label: 'Unsaved changes'},
				{url: 'form', label: 'Forms'},
				{url: 'button', label: 'Buttons'}
			]
		},
		{
			url: 'styles', label: 'Styles', children: [
				{url: 'typography', label: 'Typography'},
				{url: 'block', label: 'Block elements'},
				{url: 'inline', label: 'Inline elements'},
				{url: 'lists', label: 'Lists'},
				{url: 'table', label: 'HTML table'},
				{url: 'stepper', label: 'HTML Stepper'},
				{url: 'tabs', label: 'HTML tabs'},
				{url: 'alert', label: 'Alert'},
				{url: 'palette', label: 'Palette'}
			]
		},
		{
			url: 'bootstrap', label: 'Bootstrap', children: [
				{url: 'list-group', label: 'List group'},
				{url: 'tabs', label: 'Tabs'}
			]
		},
		{
			url: 'material', label: 'Material', children: [
				{url: 'badge', label: 'Badge'},
				{url: 'card', label: 'Card'},
				{url: 'chips', label: 'Chips'},
				{url: 'dialog', label: 'Dialog'},
				{url: 'expansion-panel', label: 'Expansion Panel'},
				{url: 'progress-bar', label: 'Progress bar'},
				{url: 'slider', label: 'Slider'},
				{url: 'stepper-horizontal', label: 'Stepper horizontal'},
				{url: 'stepper-vertical', label: 'Stepper vertical'},
				{url: 'table', label: 'Table'},
				{url: 'tabs', label: 'Tabs'},
				{url: 'tooltip', label: 'Tooltip'}
			]
		}
	];
	searchItems: ObISearchWidgetItem[] = [];

	constructor(private readonly theme: ObThemeService) {
		this.populateSearchItems(this.navigation);
		this.theme$ = this.theme.theme$.pipe(map(() => theme.isMaterial() ? 'material' : 'bootstrap'));
		this.font$ = this.theme.font$;
	}

	toggleTheme() {
		this.theme.setTheme(this.theme.isMaterial() ? THEMES.BOOTSTRAP : THEMES.MATERIAL);
	}

	toggleFont(font: string): void {
		this.theme.setFont(font === FONTS.FRUTIGER ? FONTS.ROBOTO : FONTS.FRUTIGER);
	}

	populateSearchItems(items: ObINavigationLink[], base = ''): void {
		items.forEach((item: ObINavigationLink) => {
			const url = item.url;
			if (item.children) {
				this.populateSearchItems(item.children, url);
			} else {
				this.searchItems.push({
					id: base ? `${base}_${url}` : url,
					label: item.label,
					routes: [base].concat(url.split('/')),
					description: base ? `${base} > ${url}` : url
				});
			}
		});
	}
}
