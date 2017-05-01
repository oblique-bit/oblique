import {NgModule, ModuleWithProviders} from '@angular/core';

import {DatepickerModule} from './datepicker/datepicker.module';
import {DocumentMetaModule} from './document-meta/document-meta.module';
import {ErrorMessagesModule} from './error-messages/error-messages.module';
import {FormControlStateModule} from './form-control-state';
import {MultiselectModule} from './multiselect';
import {NavigableModule} from './navigable';
import {NavigatorModule} from './navigator';
import {NavTreeModule} from './nav-tree';
import {NotificationModule} from './notification';
import {SchemaValidationModule} from './schema-validation';
import {SpinnerModule} from './spinner';
import {TopControlModule} from './top-control';
import {UnsavedChangesModule} from './unsaved-changes';

export * from './datepicker';
export * from './document-meta';
export * from './error-messages';
export * from './form-control-state';
export * from './multiselect';
export * from './navigable';
export * from './navigator';
export * from './nav-tree';
export * from './notification';
export * from './schema-validation';
export * from './spinner';
export * from './top-control';
export * from './unsaved-changes';

const OBLIQUE_MODULES = [
	DatepickerModule,
	DocumentMetaModule,
	ErrorMessagesModule,
	FormControlStateModule,
	MultiselectModule,
	NavigableModule,
	NavigatorModule,
	NavTreeModule,
	NotificationModule,
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
		FormControlStateModule.forRoot(),
		MultiselectModule.forRoot(),
		NavigableModule.forRoot(),
		NavigatorModule.forRoot(),
		NavTreeModule.forRoot(),
		NotificationModule.forRoot(),
		SpinnerModule.forRoot(),
		SchemaValidationModule.forRoot(),
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
