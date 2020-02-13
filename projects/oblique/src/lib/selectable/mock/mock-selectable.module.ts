import {NgModule} from '@angular/core';
import {MockSelectableDirective} from './mock-selectable.directive';
import {MockSelectableService} from './mock-selectable.service';
import {ObSelectableService} from '../selectable.service';

export {MockSelectableDirective} from './mock-selectable.directive';
export {MockSelectableService} from './mock-selectable.service';

@NgModule({
	declarations: [
		MockSelectableDirective
	],
	exports: [
		MockSelectableDirective
	],
	providers: [
		{provide: ObSelectableService, useClass: MockSelectableService}
	]
})
export class MockObSelectableModule {
}
