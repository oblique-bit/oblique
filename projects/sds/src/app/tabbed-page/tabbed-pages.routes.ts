import {TabbedPageComponent} from './tabbed-page.component';

export default [
	{path: '', component: TabbedPageComponent},
	{path: ':selectedTab', component: TabbedPageComponent},
	{path: '**', redirectTo: '../invalid'},
];
