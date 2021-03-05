import {NgModule} from '@angular/core';
import {ObMockMatElement} from 'oblique';

export {ObMockMatElement} from './mock-mat-element';

@NgModule({
	declarations: [ObMockMatElement],
	exports: [ObMockMatElement]
})
export class ObMockModule {}
