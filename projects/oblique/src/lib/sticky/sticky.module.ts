import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StickyComponent} from './sticky.component';

export {StickyComponent}  from './sticky.component';

@NgModule({
	imports: [CommonModule],
	declarations: [StickyComponent],
	exports: [StickyComponent]
})
export class StickyModule {
}
