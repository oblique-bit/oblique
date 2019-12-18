import {NgModule} from '@angular/core';
import {UnsavedChangesTabsService} from '../unsaved-changes-tabs.module';
import {MockUnsavedChangesTabsDirective} from './mock-unsaved-changes-tabs.directive';
import {MockUnsavedChangesTabsService} from './mock-unsaved-changes-tabs.service';

export {MockUnsavedChangesTabsDirective} from './mock-unsaved-changes-tabs.directive';
export {MockUnsavedChangesTabsService} from './mock-unsaved-changes-tabs.service';

@NgModule({
	declarations: [MockUnsavedChangesTabsDirective],
	exports: [MockUnsavedChangesTabsDirective],
	providers: [
		{provide: UnsavedChangesTabsService, useClass: MockUnsavedChangesTabsService}
	]
})
export class MockUnsavedChangesTabsModule {
}
