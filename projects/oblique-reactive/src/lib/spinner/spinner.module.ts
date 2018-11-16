import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SpinnerComponent} from './spinner.component';
import {SpinnerService} from './spinner.service';

export {SpinnerComponent} from './spinner.component';
export {SpinnerService} from './spinner.service';
export {SpinnerEvent} from './spinner-event';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [SpinnerComponent],
	exports: [SpinnerComponent]
})
export class SpinnerModule {
}
