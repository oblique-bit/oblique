import {NgModule, ModuleWithProviders} from '@angular/core';

import {ColumnLayoutModule} from './column-layout';
import {DatepickerModule} from './datepicker';
import {DocumentMetaModule} from './document-meta';
import {ErrorMessagesModule} from './error-messages';
import {FilterBoxModule} from './filter-box';
import {FormControlStateModule} from './form-control-state';
import {MasterLayoutModule} from './master-layout';
import {MultiselectModule} from './multiselect';
import {NavigableModule} from './navigable';
import {NavigatorModule} from './navigator';
import {NavTreeModule} from './nav-tree';
import {NotificationModule} from './notification';
import {SchemaValidationModule} from './schema-validation';
import {ScrollingModule} from './scrolling';
import {SpinnerModule} from './spinner';
import {ToggleModule} from './toggle';
import {UnsavedChangesModule} from './unsaved-changes';
import {NumberFormatModule} from './number-format';

export * from './column-layout';
export * from './datepicker';
export * from './document-meta';
export * from './error-messages';
export * from './filter-box';
export * from './form-control-state';
export * from './master-layout';
export * from './multiselect';
export * from './navigable';
export * from './navigator';
export * from './nav-tree';
export * from './notification';
export * from './schema-validation';
export * from './scrolling';
export * from './spinner';
export * from './toggle';
export * from './unsaved-changes';
export * from './unsubscribe';
export * from './number-format';

const OBLIQUE_MODULES = [
	ColumnLayoutModule,
	DatepickerModule,
	DocumentMetaModule,
	ErrorMessagesModule,
	FilterBoxModule,
	FormControlStateModule,
	MasterLayoutModule,
	MultiselectModule,
	NavigableModule,
	NavigatorModule,
	NavTreeModule,
	NotificationModule,
	SchemaValidationModule,
	ScrollingModule,
	SpinnerModule,
	ToggleModule,
	UnsavedChangesModule,
	NumberFormatModule
];

@NgModule({
	imports: [
		ColumnLayoutModule.forRoot(),
		DatepickerModule.forRoot(),
		DocumentMetaModule.forRoot(),
		ErrorMessagesModule.forRoot(),
		FilterBoxModule.forRoot(),
		FormControlStateModule.forRoot(),
		MasterLayoutModule.forRoot(),
		MultiselectModule.forRoot(),
		NavigableModule.forRoot(),
		NavigatorModule.forRoot(),
		NavTreeModule.forRoot(),
		NotificationModule.forRoot(),
		SchemaValidationModule.forRoot(),
		ScrollingModule.forRoot(),
		SpinnerModule.forRoot(),
		ToggleModule.forRoot(),
		UnsavedChangesModule.forRoot(),
		NumberFormatModule.forRoot()
	],
	exports: OBLIQUE_MODULES
})
export class ObliqueRootModule {
}

@NgModule({
	imports: OBLIQUE_MODULES,
	exports: OBLIQUE_MODULES
})
export class ObliqueModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ObliqueRootModule
		};
	}
}
