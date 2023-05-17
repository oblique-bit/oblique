import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObFormFieldDirective} from './form-field.directive';
import {obliqueProviders} from '../utilities';
import {ObSelectDirective} from './select.directive';

export {ObFormFieldDirective} from './form-field.directive';
export {ObSelectDirective} from './select.directive';

@NgModule({
	declarations: [ObFormFieldDirective, ObSelectDirective],
	imports: [CommonModule],
	providers: obliqueProviders(),
	exports: [ObFormFieldDirective, ObSelectDirective]
})
export class ObFormFieldModule {}
