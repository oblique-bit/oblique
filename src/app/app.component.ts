import {Component} from '@angular/core';
import {FONTS, ORNavigationLink, SearchWidgetItem, THEMES, ThemeService} from 'oblique';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`.fa-sign-in-alt {
        transition: transform 600ms;
    }`]
})
export class AppComponent {
	offCanvasOpen = false;
	material: boolean;
	frutiger: boolean;
	navigation: ORNavigationLink[] = [
		{url: 'home', label: 'i18n.routes.home.title'},
		{
			url: 'samples', label: 'i18n.routes.samples.title', children: [
				{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: 'datepicker', label: 'i18n.routes.samples.datepicker.title'},
				{url: 'filter-box', label: 'i18n.routes.samples.filter-box.title'},
				{url: 'http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: 'master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: 'multi-translate-loader', label: 'Multi translate loader'},
				{url: 'multiselect', label: 'i18n.routes.samples.multiselect.title'},
				{url: 'navigable', label: 'i18n.routes.samples.navigable.title'},
				{url: 'nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: 'nested-form', label: 'Nested froms'},
				{url: 'notification', label: 'i18n.routes.samples.notification.title'},
				{url: 'number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: 'pop-up', label: 'Pop-up'},
				{url: 'toggle', label: 'i18n.routes.samples.toggle.title'},
				{url: 'validation/form-control-state', label: 'i18n.routes.samples.form-control-state.title'},
				{url: 'validation/schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: 'validation/unsaved-changes', label: 'i18n.routes.samples.unsaved-changes.title'},
				{url: 'error-messages', label: 'Error messages'},
				{url: 'selectable', 'label': 'Selectable'},
				{url: 'sticky', label: 'Sticky'},
				{url: 'unknown-route-sample', label: 'Unknown route'},
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
				{url: 'palette', label: 'Palette'}
			]
		},
		{
			url: 'bootstrap', label: 'Bootstrap', children: [
				{url: 'list-group', label: 'List group'}
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
				{url: 'table', label: 'Table'}
			]
		}
	];
	searchItems: SearchWidgetItem[] = [];

	constructor(private readonly theme: ThemeService) {
		this.populateSearchItems(this.navigation);
		this.theme.theme$.subscribe(() => {
			this.material = theme.isMaterial();
		});
		this.theme.font$.subscribe((font) => {
			this.frutiger = font === FONTS.FRUTIGER;
		});
	}

	toggleTheme() {
		this.material = !this.material;
		this.theme.setTheme(this.material ? THEMES.MATERIAL : THEMES.BOOTSTRAP);
	}

	toggleFont() {
		this.frutiger = !this.frutiger;
		this.theme.setFont(this.frutiger ? FONTS.FRUTIGER : FONTS.ROBOTO);
	}

	populateSearchItems(items: ORNavigationLink[], base = ''): void {
		items.forEach((item: ORNavigationLink) => {
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
