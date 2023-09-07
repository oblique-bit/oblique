import {NgModule} from '@angular/core';
import {ObMockButtonDirective} from './mock-button.directive';

export {ObMockButtonDirective} from './mock-button.directive';

@NgModule({
	imports: [ObMockButtonDirective],
	exports: [ObMockButtonDirective]
})
export class ObMockButtonModule {}
