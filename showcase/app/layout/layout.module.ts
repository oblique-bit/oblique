import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {LayoutControlsComponent} from './controls/controls.component';
import {LayoutNavigationComponent} from './navigation/navigation.component';
import {RouterModule} from "@angular/router";

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule
	],
	declarations: [LayoutControlsComponent, LayoutNavigationComponent],
	exports: [LayoutControlsComponent, LayoutNavigationComponent]
})
export class LayoutModule {
}
