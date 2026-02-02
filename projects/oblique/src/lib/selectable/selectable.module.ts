import {NgModule} from '@angular/core';
import {ObSelectableDirective} from './selectable.directive';
import {ObSelectableGroupDirective} from './selectable-group.directive';

export {ObSelectableDirective} from './selectable.directive';
export {ObSelectableGroupDirective} from './selectable-group.directive';

@NgModule({
	imports: [ObSelectableDirective, ObSelectableGroupDirective],
	exports: [ObSelectableDirective, ObSelectableGroupDirective],
})
export class ObSelectableModule {}
