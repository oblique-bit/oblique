import type {Routes} from '@angular/router';

export const routes: Routes = [
	{path: 'home', loadComponent: () => import('./home/home.component').then(module => module.HomeComponent)},
	{path: 'design-system', loadChildren: () => import('./design-system/design-system.routes').then(module => module.routes)},
	{path: '', pathMatch: 'full', redirectTo: 'home'}
];
