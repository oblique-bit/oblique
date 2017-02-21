import {NgModule, ModuleWithProviders} from '@angular/core';
import {NotificationModule} from './notification/notification.module';
import {SpinnerModule} from './spinner/spinner.module';
import {NavigableModule} from './navigable/navigable.module';
import {SchemaValidationModule} from './schema-validation/schema-validation.module';

//TODO: barrels
export {NotificationService} from './notification/notification.service';
export {NotificationModule} from './notification/notification.module';

export {SpinnerModule} from './spinner/spinner.module';
export {SpinnerService} from './spinner/spinner.service';
export {SchemaValidationService} from './schema-validation/schema-validation.service';

const OBLIQUE_MODULES = [
    NotificationModule,
    SpinnerModule,
    NavigableModule,
    SchemaValidationModule
];

@NgModule({
    imports: [
        NotificationModule.forRoot(),
        SpinnerModule.forRoot(),
        NavigableModule.forRoot(),
        SchemaValidationModule.forRoot()
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