import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {UnsavedChangesDirective} from './unsaved-changes.directive';
import {UnsavedChangesService} from './unsaved-changes.service';
import {UnsavedChangesGuard} from './unsaved-changes.guard';

export {UnsavedChangesDirective} from './unsaved-changes.directive';
export {UnsavedChangesService} from './unsaved-changes.service';
export {UnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [UnsavedChangesDirective],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [UnsavedChangesDirective]
})
export class UnsavedChangesModule {
}
