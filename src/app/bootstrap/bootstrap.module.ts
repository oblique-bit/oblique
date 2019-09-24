import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { ListGroupComponent } from './list-group/list-group.component';

@NgModule({
	declarations: [ListGroupComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'list-group', component: ListGroupComponent}
		])
	]
})
export class BootstrapModule {
}
