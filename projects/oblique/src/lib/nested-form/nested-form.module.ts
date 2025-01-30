import {NgModule} from '@angular/core';
import {ObParentFormDirective} from './parent-form.directive';
import {ObNestedFormComponent} from './nested-form.component';

export {ObParentFormDirective} from './parent-form.directive';
export {ObNestedFormComponent} from './nested-form.component';

@NgModule({
	imports: [ObNestedFormComponent, ObParentFormDirective],
	exports: [ObNestedFormComponent, ObParentFormDirective]
})
export class ObNestedFormModule {}
