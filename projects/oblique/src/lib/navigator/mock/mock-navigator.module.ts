import {NgModule} from '@angular/core';

import {ObMockNavigatorComponent} from './mock-navigator.component';

export {ObMockNavigatorComponent} from './mock-navigator.component';

@NgModule({
	declarations: [ObMockNavigatorComponent],
	exports: [ObMockNavigatorComponent]
})
export class ObMockNavigatorModule {}
