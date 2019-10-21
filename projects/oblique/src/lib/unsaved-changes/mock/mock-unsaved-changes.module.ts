import {NgModule} from '@angular/core';

import {UnsavedChangesGuard, UnsavedChangesService} from '../unsaved-changes.module';
import {MockUnsavedChangesDirective} from './mock-unsaved-changes.directive';
import {MockUnsavedChangesService} from './mock-unsaved-changes.service';
import {MockUnsavedChangesGuard} from './mock-unsaved-changes.guard';

export {MockUnsavedChangesDirective} from './mock-unsaved-changes.directive';
export {MockUnsavedChangesService} from './mock-unsaved-changes.service';
export {MockUnsavedChangesGuard} from './mock-unsaved-changes.guard';

@NgModule({
	declarations: [MockUnsavedChangesDirective],
	exports: [MockUnsavedChangesDirective],
	providers: [
		{provide: UnsavedChangesService, useClass: MockUnsavedChangesService},
		{provide: UnsavedChangesGuard, useClass: MockUnsavedChangesGuard}
	]
})
export class MockUnsavedChangesModule {
}
