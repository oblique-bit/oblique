import {NgModule, ModuleWithProviders} from '@angular/core';

import {ColumnLayoutModule} from './column-layout';
import {DatepickerModule} from './datepicker';
import {DocumentMetaModule} from './document-meta';
import {ErrorMessagesModule} from './error-messages';
import {FilterBoxModule} from './filter-box';
import {FormControlStateModule} from './form-control-state';
import {MasterLayoutModule} from './master-layout';
import {MultiselectModule} from './multiselect';
import {NavigatorModule} from './navigator';
import {NavigableModule} from './navigable';
import {NavTreeModule} from './nav-tree';
import {NotificationModule} from './notification';
import {ObliqueHttpModule} from './http';
import {SchemaValidationModule} from './schema-validation';
import {ScrollingModule} from './scrolling';
import {SpinnerModule} from './spinner';
import {TextControlClearModule} from './text-control-clear';
import {ToggleModule} from './toggle';
import {UnsavedChangesModule} from './unsaved-changes';
import {NumberFormatModule} from './number-format';
import {OffCanvasModule} from './off-canvas';

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
	NumberFormatModule,
	ObliqueHttpModule,
	OffCanvasModule,
	SchemaValidationModule,
	ScrollingModule,
	SpinnerModule,
	TextControlClearModule,
	ToggleModule,
	UnsavedChangesModule
];

@NgModule({
	imports: [
		ColumnLayoutModule,
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
		NumberFormatModule.forRoot(),
		ObliqueHttpModule.forRoot(),
		OffCanvasModule.forRoot(),
		SchemaValidationModule.forRoot(),
		ScrollingModule.forRoot(),
		SpinnerModule.forRoot(),
		TextControlClearModule.forRoot(),
		ToggleModule.forRoot(),
		UnsavedChangesModule.forRoot()
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
