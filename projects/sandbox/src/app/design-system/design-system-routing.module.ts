import {NgModule} from '@angular/core';
import {RouterModule, type Routes} from '@angular/router';
import {DesignSystemComponent} from './design-system.component';

const routes: Routes = [{path: '', component: DesignSystemComponent}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DesignSystemRoutingModule {}
