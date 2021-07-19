import {NgModule} from '@angular/core';
import {ObMockButtonDirective} from './mock-button.directive';

export {ObMockButtonDirective} from './mock-button.directive';

@NgModule({
	declarations: [ObMockButtonDirective],
	exports: [ObMockButtonDirective]
})
export class ObMockButtonModule {}
