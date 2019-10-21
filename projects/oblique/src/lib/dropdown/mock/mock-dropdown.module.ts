import {NgModule} from '@angular/core';
import {MockDropdownComponent} from './mock-dropdown.component';

export {MockDropdownComponent} from './mock-dropdown.component';

@NgModule({
	declarations: [MockDropdownComponent],
	exports: [MockDropdownComponent]
})
export class MockDropdownModule {
}
