import {NgModule} from '@angular/core';
import {ObMockMatElement} from './mock-mat-element';

export {ObMockMatElement} from './mock-mat-element';

@NgModule({
	imports: [ObMockMatElement],
	exports: [ObMockMatElement]
})
export class ObMockModule {}
