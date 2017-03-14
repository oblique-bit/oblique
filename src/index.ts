import {NgModule, ModuleWithProviders} from '@angular/core';

import {DatepickerModule} from "./datepicker/datepicker.module";
import {NavigableModule} from './navigable';
import {NotificationModule} from './notification';
import {SchemaValidationModule} from './schema-validation';
import {SpinnerModule} from './spinner';
import {TopControlModule} from './top-control';
import {UnsavedChangesModule} from './unsaved-changes';

export * from './datepicker';
export * from './navigable';
export * from './notification';
export * from './schema-validation';
export * from './spinner';
export * from './top-control';
export * from './unsaved-changes';

const OBLIQUE_MODULES = [
    DatepickerModule,
    NavigableModule,
    NotificationModule,
    SpinnerModule,
    SchemaValidationModule,
    TopControlModule,
    UnsavedChangesModule
];

@NgModule({
    imports: [
        DatepickerModule.forRoot(),
        NavigableModule.forRoot(),
        NotificationModule.forRoot(),
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