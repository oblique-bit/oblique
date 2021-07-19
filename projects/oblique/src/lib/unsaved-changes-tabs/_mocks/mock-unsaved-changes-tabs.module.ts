import {NgModule} from '@angular/core';
import {ObUnsavedChangesTabsService} from '../unsaved-changes-tabs.module';
import {ObMockUnsavedChangesTabsDirective} from './mock-unsaved-changes-tabs.directive';
import {ObMockUnsavedChangesTabsService} from './mock-unsaved-changes-tabs.service';

export {ObMockUnsavedChangesTabsDirective} from './mock-unsaved-changes-tabs.directive';
export {ObMockUnsavedChangesTabsService} from './mock-unsaved-changes-tabs.service';

@NgModule({
	declarations: [ObMockUnsavedChangesTabsDirective],
	exports: [ObMockUnsavedChangesTabsDirective],
	providers: [{provide: ObUnsavedChangesTabsService, useClass: ObMockUnsavedChangesTabsService}]
})
export class ObMockUnsavedChangesTabsModule {}
