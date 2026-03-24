import type {Routes} from '@angular/router';

export const routes: Routes = [
	{path: 'home', loadComponent: async () => import('./home/home.component').then(module => module.HomeComponent)},
	{path: 'text', loadComponent: async () => import('./text/text').then(module => module.Text)},
	{
		path: 'design-system',
		loadChildren: async () => import('./design-system/design-system.routes').then(module => module.routes),
	},
	{path: '', pathMatch: 'full', redirectTo: 'home'},
];
