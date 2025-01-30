import {NgModule} from '@angular/core';
import {ObButtonDirective} from './button.directive';
import {obliqueProviders} from '../utilities';

export {ObButtonDirective} from './button.directive';

@NgModule({
	imports: [ObButtonDirective],
	providers: obliqueProviders(),
	exports: [ObButtonDirective]
})
export class ObButtonModule {}
