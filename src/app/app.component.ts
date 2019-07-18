import {Component} from '@angular/core';
import {MaterialService, ORNavigationLink, SearchWidgetItem} from 'oblique';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`.fa-sign-in {
		transition: transform 600ms;
	}`]
})
export class AppComponent {
	offCanvasOpen = false;
	material: boolean;
	navigation: ORNavigationLink[] = [
		{url: 'home', label: 'i18n.routes.home.title'},
		{
			url: 'samples', label: 'i18n.routes.samples.title', children: [
				{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: 'datepicker', label: 'i18n.routes.samples.datepicker.title'},
				{url: 'filter-box', label: 'i18n.routes.samples.filter-box.title'},
				{url: 'http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: 'master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: 'multiselect', label: 'i18n.routes.samples.multiselect.title'},
				{url: 'navigable', label: 'i18n.routes.samples.navigable.title'},
				{url: 'nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: 'notification', label: 'i18n.routes.samples.notification.title'},
				{url: 'number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: 'toggle', label: 'i18n.routes.samples.toggle.title'},
				{url: 'validation/form-control-state', label: 'i18n.routes.samples.form-control-state.title'},
				{url: 'validation/schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: 'validation/unsaved-changes', label: 'i18n.routes.samples.unsaved-changes.title'},
				{url: 'sticky', label: 'Sticky'},
				{url: 'form', label: 'Forms'},
				{url: 'button', label: 'Buttons'}
			]
		},
		{url: 'styles', label: 'styles'}
	];
	searchItems: SearchWidgetItem[] = [];

	constructor(private materialService: MaterialService) {
		this.populateSearchItems(this.navigation);
		this.material = materialService.enabled;
		this.setTheme();
	}

	toggle() {
		this.material = !this.material;
		this.materialService.enabled = this.material;
		this.setTheme();
	}

	populateSearchItems(items: ORNavigationLink[], base = ''): void {
		items.forEach((item: ORNavigationLink) => {
			const url = item.url.substr(1);
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

	private setTheme(): void {
		const link = document.getElementById('dynamic-theme');
		link['href'] = 'assets/styles/css/oblique-' + (this.material ? 'material' : 'bootstrap') + '.css';
	}
}
