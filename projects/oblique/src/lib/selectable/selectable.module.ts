import {NgModule} from '@angular/core';
import {ObSelectableDirective} from './selectable.directive';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObSelectableDirective} from './selectable.directive';
export {ObSelectableGroupDirective} from './selectable-group.directive';

@NgModule({
	imports: [ObSelectableDirective, ObSelectableGroupDirective],
	providers: obliqueProviders(),
	exports: [ObSelectableDirective, ObSelectableGroupDirective, ...obliqueExports]
})
export class ObSelectableModule {}
