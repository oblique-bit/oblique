import type {Routes} from '@angular/router';
import {Demo} from './demo/demo';
import {Icon} from './icon/icon';

export const routes: Routes = [
	{path: 'demo', component: Demo},
	{path: 'icon', component: Icon},
	{path: '', pathMatch: 'full', redirectTo: 'test'},
];
