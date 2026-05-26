import {NgModule} from '@angular/core';

import {ObUnsavedChangesGuard, ObUnsavedChangesService} from '../unsaved-changes.module';
import {ObMockUnsavedChangesDirective} from './mock-unsaved-changes.directive';
import {ObMockUnsavedChangesService} from './mock-unsaved-changes.service';
import {ObMockUnsavedChangesGuard} from './mock-unsaved-changes.guard';

export {ObMockUnsavedChangesDirective} from './mock-unsaved-changes.directive';
export {ObMockUnsavedChangesService} from './mock-unsaved-changes.service';
export {ObMockUnsavedChangesGuard} from './mock-unsaved-changes.guard';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockUnsavedChangesDirective],
	providers: [
		{provide: ObUnsavedChangesService, useClass: ObMockUnsavedChangesService},
		{provide: ObUnsavedChangesGuard, useClass: ObMockUnsavedChangesGuard},
	],
	exports: [ObMockUnsavedChangesDirective],
})
export class ObMockUnsavedChangesModule {}
