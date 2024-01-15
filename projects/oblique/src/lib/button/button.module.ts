import {NgModule} from '@angular/core';
import {ObButtonDirective} from './button.directive';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObButtonDirective} from './button.directive';

@NgModule({
	imports: [ObButtonDirective],
	providers: obliqueProviders(),
	exports: [ObButtonDirective, ...obliqueExports]
})
export class ObButtonModule {}
