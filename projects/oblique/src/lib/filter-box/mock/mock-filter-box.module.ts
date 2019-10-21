import {NgModule} from '@angular/core';
import {MockFilterBoxComponent} from './mock-filter-box.component';

export {MockFilterBoxComponent} from './mock-filter-box.component';

@NgModule({
	declarations: [MockFilterBoxComponent],
	exports: [MockFilterBoxComponent]
})
export class MockFilterBoxModule {
}
