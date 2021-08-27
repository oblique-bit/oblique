import {Component} from '@angular/core';
import {ObINavigationLink, ObISearchWidgetItem} from '@oblique/oblique';

@Component({
	selector: 'ob-search-box-sample',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss']
})
export class ObSearchBoxSampleComponent {
	searchItems: ObISearchWidgetItem[] = [];
	slide = true;
	private readonly navigation: ObINavigationLink[] = [
		{url: '/home', label: 'i18n.routes.home.title'},
		{
			url: '/samples',
			label: 'i18n.routes.samples.title',
			children: [
				{url: '/column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: '/datepicker', label: 'i18n.routes.samples.datepicker.title'},
				{url: '/http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: '/master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: '/multiselect', label: 'i18n.routes.samples.multiselect.title'},
				{url: '/nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: '/notification', label: 'i18n.routes.samples.notification.title'},
				{url: '/number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: '/toggle', label: 'i18n.routes.samples.toggle.title'},
				{url: '/validation/form-control-state', label: 'i18n.routes.samples.form-control-state.title'},
				{url: '/validation/schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: '/validation/unsaved-changes', label: 'i18n.routes.samples.unsaved-changes.title'}
			]
		}
	];

	constructor() {
		this.populateSearchItems(this.navigation);
	}

	populateSearchItems(items: ObINavigationLink[], base = ''): void {
		items.forEach((item: ObINavigationLink) => {
			const url = item.url.substr(1);
			if (item.children) {
				this.populateSearchItems(item.children, url);
			} else {
				this.searchItems.push({
					id: base ? `${base}_${url}` : url,
					label: item.label,
					routes: ['/', base].concat(url.split('/')),
					description: base ? `${base} > ${url}` : url
				});
			}
		});
	}
}
