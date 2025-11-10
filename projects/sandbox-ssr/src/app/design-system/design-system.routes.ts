import type {Routes} from '@angular/router';
import {TestComponent} from './test/test.component';

export const routes: Routes = [
	{path: 'test', component: TestComponent},
	{path: '', pathMatch: 'full', redirectTo: 'test'},
];
