import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {NavigatorComponent} from './navigator.component';

export {NavigatorComponent} from './navigator.component';

@NgModule({
	imports: [
		RouterModule
	],
	declarations: [
		NavigatorComponent
	],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		NavigatorComponent
	]
})
export class NavigatorModule {
}

