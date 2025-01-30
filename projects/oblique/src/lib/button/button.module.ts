import {NgModule} from '@angular/core';
import {ObButtonDirective} from './button.directive';

export {ObButtonDirective} from './button.directive';

@NgModule({
	imports: [ObButtonDirective],
	exports: [ObButtonDirective]
})
export class ObButtonModule {}
