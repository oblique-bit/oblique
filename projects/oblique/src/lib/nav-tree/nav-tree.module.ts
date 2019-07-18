import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {NavTreeComponent} from './nav-tree.component';
import {NavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';

export {NavTreeComponent} from './nav-tree.component';
export {NavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
export {NavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		RouterModule,
		TranslateModule
	],
	declarations: [
		NavTreeComponent,
		NavTreeFakeFocusDirective
	],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		NavTreeComponent,
		NavTreeFakeFocusDirective
	]
})
export class NavTreeModule {
}
