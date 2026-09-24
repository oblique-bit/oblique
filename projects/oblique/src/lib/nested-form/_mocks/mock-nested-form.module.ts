import {NgModule} from '@angular/core';
import {ObMockParentFormDirective} from './mock-parent-form.directive';
import {ObMockNestedFormComponent} from './mock-nested-form.component';

export {ObMockParentFormDirective} from './mock-parent-form.directive';
export {ObMockNestedFormComponent} from './mock-nested-form.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockNestedFormComponent, ObMockParentFormDirective],
	exports: [ObMockNestedFormComponent, ObMockParentFormDirective],
})
export class ObMockNestedFormModule {}
