import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ListGroupComponent} from './list-group/list-group.component';
import {TabsComponent} from './tabs/tabs.component';

@NgModule({
	declarations: [ListGroupComponent, TabsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'list-group', component: ListGroupComponent},
			{path: 'tabs', component: TabsComponent}
		]),
		NgbNavModule
	]
})
export class BootstrapModule {}
