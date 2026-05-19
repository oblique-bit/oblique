import type {Routes} from '@angular/router';
import {Demo} from './demo/demo';

export const routes: Routes = [
	{path: 'demo', component: Demo},
	{path: '', pathMatch: 'full', redirectTo: 'test'},
];
