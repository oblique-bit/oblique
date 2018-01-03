import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ObliqueModule} from '../../../../lib/ng';
import {NavigatorSampleRoutingModule} from './navigator-sample-routing.module';
import {
	ChildState1Component, NavigatorSampleComponent, ChildState11Component,
	ChildState111Component, ChildState112Component, ChildState12Component
} from './navigator-sample.component';


@NgModule({
	imports: [
		CommonModule,
		NavigatorSampleRoutingModule,
		TranslateModule,
		ObliqueModule
	],
	declarations: [
		NavigatorSampleComponent,
		ChildState1Component,
		ChildState11Component,
		ChildState111Component,
		ChildState112Component,
		ChildState12Component
	]
})
export class NavigatorSampleModule {
}
