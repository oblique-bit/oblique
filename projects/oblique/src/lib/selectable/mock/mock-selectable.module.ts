import {NgModule} from '@angular/core';
import {ObMockSelectableDirective} from './mock-selectable.directive';
import {ObMockSelectableService} from './mock-selectable.service';
import {ObSelectableService} from '../selectable.service';

export {ObMockSelectableDirective} from './mock-selectable.directive';
export {ObMockSelectableService} from './mock-selectable.service';

@NgModule({
	declarations: [
		ObMockSelectableDirective
	],
	exports: [
		ObMockSelectableDirective
	],
	providers: [
		{provide: ObSelectableService, useClass: ObMockSelectableService}
	]
})
export class ObMockObSelectableModule {
}
