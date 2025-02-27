import {NgModule} from '@angular/core';

import {ObUnsavedChangesDirective} from './unsaved-changes.directive';

export {ObUnsavedChangesDirective} from './unsaved-changes.directive';
export {ObUnsavedChangesGuard} from './unsaved-changes.guard';
export {ObUnsavedChangesService} from './unsaved-changes.service';

@NgModule({
	imports: [ObUnsavedChangesDirective],
	exports: [ObUnsavedChangesDirective]
})
export class ObUnsavedChangesModule {}
