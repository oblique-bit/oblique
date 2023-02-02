import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObStickyComponent} from './sticky.component';
import {obliqueProviders} from '../utilities';

export {ObStickyComponent} from './sticky.component';

@NgModule({
	imports: [CommonModule],
	declarations: [ObStickyComponent],
	exports: [ObStickyComponent],
	providers: obliqueProviders()
})
export class ObStickyModule {}
