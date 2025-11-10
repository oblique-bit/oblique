import {NgModule} from '@angular/core';
import {ObButtonDirective} from './button.directive';
import {ObIconButtonDirective} from './icon-button.directive';

export {ObButtonDirective} from './button.directive';
export {ObIconButtonDirective} from './icon-button.directive';

@NgModule({
	imports: [ObButtonDirective, ObIconButtonDirective],
	exports: [ObButtonDirective, ObIconButtonDirective],
})
export class ObButtonModule {}
