import {NgModule} from '@angular/core';
import {ObMockSearchBoxDirective} from './mock-search-box.directive';
import {ObMockSearchBoxComponent} from './mock-search-box.component';

export {ObMockSearchBoxDirective} from './mock-search-box.directive';
export {ObMockSearchBoxComponent} from './mock-search-box.component';

@NgModule({
	declarations: [ObMockSearchBoxComponent, ObMockSearchBoxDirective],
	exports: [ObMockSearchBoxComponent, ObMockSearchBoxDirective]
})
export class ObMockSearchBoxModule {}
