import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {SearchBoxDirective} from './search-box.directive';
import {SearchBoxResultsComponent} from './search-box-results.component';
import {SearchBoxComponent} from './search-box.component';
import {NavTreeModule} from '../nav-tree/nav-tree.module';

export {SearchBoxResultsComponent} from './search-box-results.component';
export {SearchBoxComponent, SearchWidgetItem} from './search-box.component';
export {SearchBoxDirective} from './search-box.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NavTreeModule,
		TranslateModule,
		RouterModule
	],
	declarations: [SearchBoxDirective, SearchBoxComponent, SearchBoxResultsComponent],
	exports: [SearchBoxDirective, SearchBoxComponent],
	entryComponents: [SearchBoxResultsComponent]
})
export class SearchBoxModule {
}
