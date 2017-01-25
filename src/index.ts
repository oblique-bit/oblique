import {NgModule, ModuleWithProviders} from '@angular/core';
import {NotificationModule} from './notification/notification.module';
import {SpinnerModule} from './spinner/spinner.module';
import {TranslateModule} from 'ng2-translate';

//TODO: barrels
export {NotificationService} from './notification/notification.service';
export {NotificationModule} from './notification/notification.module';

export {SpinnerModule} from './spinner/spinner.module';
export {SpinnerService} from './spinner/spinner.service';

const OBLIQUE_MODULES = [
    NotificationModule,
    SpinnerModule
];

@NgModule({
    imports: [
        NotificationModule.forRoot(),
        SpinnerModule.forRoot(),
        TranslateModule
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