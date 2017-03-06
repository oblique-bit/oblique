import {NgModule, ModuleWithProviders} from '@angular/core';

import {NotificationModule} from './notification';
import {SpinnerModule} from './spinner';
import {NavigableModule} from './navigable';
import {SchemaValidationModule} from './schema-validation';
import {UnsavedChangesModule} from './unsaved-changes';

export * from './navigable';
export * from './notification';
export * from './schema-validation';
export * from './spinner';
export * from './unsaved-changes';

const OBLIQUE_MODULES = [
    NotificationModule,
    SpinnerModule,
    NavigableModule,
    SchemaValidationModule,
    UnsavedChangesModule
];

@NgModule({
    imports: [
        NotificationModule.forRoot(),
        SpinnerModule.forRoot(),
        NavigableModule.forRoot(),
        SchemaValidationModule.forRoot(),
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