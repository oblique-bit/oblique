import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MasterLayoutModule} from '../../../lib/ng';
import {LayoutNavigationComponent} from './navigation/navigation.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		MasterLayoutModule
	],
	declarations: [
		LayoutNavigationComponent
	],
	exports: [
		LayoutNavigationComponent
	]
})
export class LayoutModule {
}
