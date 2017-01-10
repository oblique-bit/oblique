import {NgModule, ModuleWithProviders} from '@angular/core';
import {NotificationModule} from './notification/notification.module';

export {NotificationService} from './notification/notification.service';
export {NotificationModule} from './notification/notification.module';

const OBLIQUE_MODULES = [
    NotificationModule
];

@NgModule({
    imports: [
        NotificationModule.forRoot()
    ],
    exports: OBLIQUE_MODULES
})
export class ObliqueRootModule {
}

@NgModule({imports: OBLIQUE_MODULES, exports: OBLIQUE_MODULES})
export class ObliqueModule {
    static forRoot(): ModuleWithProviders { return {ngModule: ObliqueRootModule}; }
}