import {NgModule, ModuleWithProviders} from '@angular/core';

import {ColumnLayoutModule} from './column-layout/column-layout.module';
import {DatepickerModule} from './datepicker/datepicker.module';
import {DocumentMetaModule} from './document-meta/document-meta.module';
import {ErrorMessagesModule} from './error-messages/error-messages.module';
import {FilterBoxModule} from './filter-box/filter-box.module';
import {FormControlStateModule} from './form-control-state/form-control-state.module';
import {MasterLayoutModule} from './master-layout/master-layout.module';
import {MultiselectModule} from './multiselect/multiselect.module';
import {NavigatorModule} from './navigator/navigator.module';
import {NavigableModule} from './navigable/navigable.module';
import {NavTreeModule} from './nav-tree/nav-tree.module';
import {NotificationModule} from './notification/notification.module';
import {ObliqueHttpModule} from './http/oblique-http.module';
import {SchemaValidationModule} from './schema-validation/schema-validation.module';
import {ScrollingModule} from './scrolling/scrolling.module';
import {SpinnerModule} from './spinner/spinner.module';
import {TextControlClearModule} from './text-control-clear/text-control-clear.module';
import {ToggleModule} from './toggle/toggle.module';
import {UnsavedChangesModule} from './unsaved-changes/unsaved-changes.module';
import {NumberFormatModule} from './number-format/number-format.module';
import {OffCanvasModule} from './off-canvas/off-canvas.module';
import {SearchBoxModule} from './searchbox/search-box.module';
import {TranslateParamsPipe} from './translate-params/translate-params.pipe';
import {TranslateParamsModule} from './translate-params/translate-params.module';

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
	SearchBoxModule,
	SpinnerModule,
	TextControlClearModule,
	ToggleModule,
	TranslateParamsModule,
	UnsavedChangesModule
];

@NgModule({
	imports: [
		ColumnLayoutModule,
		DatepickerModule.forRoot(),
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
		SearchBoxModule,
		ScrollingModule,
		SpinnerModule,
		TextControlClearModule,
		TranslateParamsModule,
		ToggleModule,
		UnsavedChangesModule
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
