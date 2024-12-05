import {NgModule} from '@angular/core';
import {ObFormFieldDirective} from './form-field.directive';
import {ObSelectDirective} from './select.directive';

export {ObFormFieldDirective} from './form-field.directive';
export {ObSelectDirective} from './select.directive';

@NgModule({
	imports: [ObFormFieldDirective, ObSelectDirective],
	exports: [ObFormFieldDirective, ObSelectDirective]
})
/**
 *  @deprecated since Oblique 12.1.0. It will be removed with Oblique 13.
 */
export class ObFormFieldModule {}
