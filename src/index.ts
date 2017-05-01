import {NgModule, ModuleWithProviders} from '@angular/core';

import {DatepickerModule} from './datepicker/datepicker.module';
import {DocumentMetaModule} from './document-meta/document-meta.module';
import {MultiselectModule} from './multiselect';
import {NavigableModule} from './navigable';
import {NotificationModule} from './notification';
import {SchemaValidationModule} from './schema-validation';
import {SpinnerModule} from './spinner';
import {TopControlModule} from './top-control';
import {UnsavedChangesModule} from './unsaved-changes';
import {NavigatorModule} from './navigator';
import {FormControlStateModule} from './form-control-state';
import {ErrorMessagesModule} from './error-messages/error-messages.module';

export * from './datepicker';
export * from './document-meta';
export * from './multiselect';
export * from './navigable';
export * from './notification';
export * from './schema-validation';
export * from './spinner';
export * from './top-control';
export * from './unsaved-changes';

const OBLIQUE_MODULES = [
	DatepickerModule,
	DocumentMetaModule,
	ErrorMessagesModule,
	MultiselectModule,
	NavigableModule,
	NavigatorModule,
	NotificationModule,
	FormControlStateModule,
	SpinnerModule,
	SchemaValidationModule,
	TopControlModule,
	UnsavedChangesModule
];

@NgModule({
	imports: [
		DatepickerModule.forRoot(),
		DocumentMetaModule.forRoot(),
		ErrorMessagesModule.forRoot(),
		MultiselectModule.forRoot(),
		NavigableModule.forRoot(),
		NavigatorModule.forRoot(),
		NotificationModule.forRoot(),
		FormControlStateModule.forRoot(),
		SchemaValidationModule.forRoot(),
		SpinnerModule.forRoot(),
		TopControlModule.forRoot(),
		UnsavedChangesModule.forRoot()
	],
	exports: OBLIQUE_MODULES
})
export class ObliqueRootModule {
}

@NgModule({imports: OBLIQUE_MODULES, exports: OBLIQUE_MODULES})
export class ObliqueModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ObliqueRootModule
		};
	}
}
