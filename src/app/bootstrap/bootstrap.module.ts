import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { ObListGroupComponent } from './list-group/list-group.component';

@NgModule({
	declarations: [ObListGroupComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'list-group', component: ObListGroupComponent}
		])
	]
})
export class BootstrapModule {
}
