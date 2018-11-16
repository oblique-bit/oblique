import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UnsavedChangesDirective} from './unsaved-changes.directive';
import {UnsavedChangesService} from './unsaved-changes.service';
import {UnsavedChangesGuard} from './unsaved-changes.guard';

export {UnsavedChangesDirective} from './unsaved-changes.directive';
export {UnsavedChangesService} from './unsaved-changes.service';
export {UnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [UnsavedChangesDirective],
	exports: [UnsavedChangesDirective]
})
export class UnsavedChangesModule {
}
