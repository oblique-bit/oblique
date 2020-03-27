import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {ObListGroupComponent} from './list-group/list-group.component';
import {TabsComponent} from './tabs/tabs.component';

@NgModule({
	declarations: [ObListGroupComponent, TabsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'list-group', component: ObListGroupComponent},
			{path: 'tabs', component: TabsComponent}
		]),
		NgbTabsetModule
	]
})
export class BootstrapModule {}
