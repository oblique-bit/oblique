import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnsavedChangesDirective} from './unsaved-changes.directive';
import {UnsavedChangesService} from './unsaved-changes.service';
import {UnsavedChangesGuard} from './unsaved-changes.guard';
import {UnsavedChangesTabDirective} from './unsaved-changes-tab.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [UnsavedChangesDirective, UnsavedChangesTabDirective],
    exports: [UnsavedChangesDirective, UnsavedChangesTabDirective]
})
export class UnsavedChangesModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: UnsavedChangesModule,
			providers: [
				UnsavedChangesService,
				UnsavedChangesGuard
			]
		};
	}
}
