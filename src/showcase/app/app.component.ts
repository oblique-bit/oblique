import {Component} from '@angular/core';
import {MasterLayoutConfig} from '../../lib/ng/master-layout';
import {ORNavigationLink} from '../../lib/ng/master-layout/master-layout-navigation.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`.fa-sign-in {transition: transform 600ms;}`]
})
export class AppComponent {
	offCanvasOpen = false;
	navigation: ORNavigationLink[] = [
		{url: '/home', label: 'i18n.routes.home.title'},
		{
			url: '/samples', label: 'i18n.routes.samples.title', children: [
				{url: '/column-layout', label: 'i18n.routes.samples.column-layout.title'},
				{url: '/datepicker', label: 'i18n.routes.samples.datepicker.title'},
				{url: '/filter-box', label: 'i18n.routes.samples.filter-box.title'},
				{url: '/form-control-state', label: 'i18n.routes.samples.form-control-state.title'},
				{url: '/http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
				{url: '/master-layout', label: 'i18n.routes.samples.master-layout.title'},
				{url: '/multiselect', label: 'i18n.routes.samples.multiselect.title'},
				{url: '/navigable', label: 'i18n.routes.samples.navigable.title'},
				{url: '/nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
				{url: '/notification', label: 'i18n.routes.samples.notification.title'},
				{url: '/number-format', label: 'i18n.routes.samples.number-format.title'},
				{url: '/schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
				{url: '/toggle', label: 'i18n.routes.samples.toggle.title'},
				{url: '/unsaved-changes', label: 'i18n.routes.samples.unsaved-changes.title'}
			]
		}
	];

	constructor(config: MasterLayoutConfig) {
		config.locales = ['en'];
	}
}
