import {NgModule} from '@angular/core';
import {MockColumnLayoutComponent} from './mock-column-layout.component';

export {MockColumnLayoutComponent} from './mock-column-layout.component';

@NgModule({
	declarations: [MockColumnLayoutComponent],
	exports: [MockColumnLayoutComponent]
})
export class MockColumnLayoutModule {
}
