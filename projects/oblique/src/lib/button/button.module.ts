import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObButtonDirective} from './button.directive';
import {obliqueProviders} from '../utilities';

export {ObButtonDirective} from './button.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObButtonDirective],
	providers: obliqueProviders(),
	exports: [ObButtonDirective]
})
export class ObButtonModule {}
