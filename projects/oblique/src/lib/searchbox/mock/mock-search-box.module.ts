import {NgModule} from '@angular/core';
import {MockSearchBoxDirective} from './mock-search-box.directive';
import {MockSearchBoxComponent} from './mock-search-box.component';

export  {MockSearchBoxDirective} from './mock-search-box.directive';
export {MockSearchBoxComponent} from './mock-search-box.component';

@NgModule({
	declarations: [MockSearchBoxDirective, MockSearchBoxComponent],
	exports: [MockSearchBoxDirective, MockSearchBoxComponent]
})
export class MockSearchBoxModule {
}
