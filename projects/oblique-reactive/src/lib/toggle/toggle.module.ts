import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ToggleDirective} from './toggle.directive';

export {ToggleDirective} from './toggle.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ToggleDirective],
	exports: [ToggleDirective]
})
export class ToggleModule {
}
