import {NgModule} from '@angular/core';
import {ObCheckboxDirective} from './checkbox.directive';

export {ObCheckboxDirective} from './checkbox.directive';

@NgModule({
	imports: [ObCheckboxDirective],
	exports: [ObCheckboxDirective]
})
export class ObCheckboxModule {}
