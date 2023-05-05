import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObCheckboxDirective} from './checkbox.directive';

export {ObCheckboxDirective} from './checkbox.directive';

@NgModule({
	declarations: [ObCheckboxDirective],
	imports: [CommonModule],
	exports: [ObCheckboxDirective]
})
export class ObCheckboxModule {}
