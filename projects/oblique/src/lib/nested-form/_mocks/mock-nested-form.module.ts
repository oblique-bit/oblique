import {NgModule} from '@angular/core';
import {ObMockParentFormDirective} from './mock-parent-form.directive';
import {ObMockNestedFormComponent} from './mock-nested-form.component';

export {ObMockParentFormDirective} from './mock-parent-form.directive';
export {ObMockNestedFormComponent} from './mock-nested-form.component';

@NgModule({
	declarations: [ObMockNestedFormComponent, ObMockParentFormDirective],
	exports: [ObMockNestedFormComponent, ObMockParentFormDirective]
})
export class ObMockNestedFormModule {}
