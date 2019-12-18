import {NgModule} from '@angular/core';

import {MockNavigatorComponent} from './mock-navigator.component';

export {MockNavigatorComponent} from './mock-navigator.component';

@NgModule({
	declarations: [MockNavigatorComponent],
	exports: [MockNavigatorComponent]
})
export class MockNavigatorModule {
}

