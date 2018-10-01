import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {NavigatorSampleRoutingModule} from './navigator-sample-routing.module';
import {
	ChildState111Component,
	ChildState112Component,
	ChildState11Component,
	ChildState12Component,
	ChildState1Component,
	NavigatorSampleComponent
} from './navigator-sample.component';
import {NavigatorModule} from 'oblique-reactive';


@NgModule({
	imports: [
		CommonModule,
		NavigatorSampleRoutingModule,
		TranslateModule,
		NavigatorModule
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
