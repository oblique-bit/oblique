import {NgModule} from '@angular/core';
import {ObParentFormDirective} from './parent-form.directive';
import {ObNestedFormComponent} from './nested-form.component';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObParentFormDirective} from './parent-form.directive';
export {ObNestedFormComponent} from './nested-form.component';

@NgModule({
	imports: [ObNestedFormComponent, ObParentFormDirective],
	providers: obliqueProviders(),
	exports: [ObNestedFormComponent, ObParentFormDirective, ...obliqueExports]
})
export class ObNestedFormModule {}
