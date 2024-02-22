import {NgModule} from '@angular/core';

import {obliqueProviders} from '../utilities';
import {ObUnsavedChangesDirective} from './unsaved-changes.directive';

export {ObUnsavedChangesDirective} from './unsaved-changes.directive';
export {ObUnsavedChangesGuard} from './unsaved-changes.guard';
export {ObUnsavedChangesService} from './unsaved-changes.service';

@NgModule({
	imports: [ObUnsavedChangesDirective],
	providers: obliqueProviders(),
	exports: [ObUnsavedChangesDirective]
})
export class ObUnsavedChangesModule {}
