import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObUnsavedChangesDirective} from './unsaved-changes.directive';
import {obliqueProviders} from '../utilities';

export {ObUnsavedChangesDirective} from './unsaved-changes.directive';
export {ObUnsavedChangesService} from './unsaved-changes.service';
export {ObUnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [ObUnsavedChangesDirective],
	providers: obliqueProviders(),
	exports: [ObUnsavedChangesDirective]
})
export class ObUnsavedChangesModule {}
