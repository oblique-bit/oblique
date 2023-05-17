import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentPagesComponent} from './component-pages.component';

const routes: Routes = [{path: '', component: ComponentPagesComponent}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ComponentPagesRoutingModule {}
