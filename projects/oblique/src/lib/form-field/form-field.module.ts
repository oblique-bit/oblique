import {NgModule} from '@angular/core';
import {ObFormFieldDirective} from './form-field.directive';
import {ObSelectDirective} from './select.directive';

export {ObFormFieldDirective} from './form-field.directive';
export {ObSelectDirective} from './select.directive';

@NgModule({
	imports: [ObFormFieldDirective, ObSelectDirective],
	exports: [ObFormFieldDirective, ObSelectDirective]
})
export class ObFormFieldModule {}
