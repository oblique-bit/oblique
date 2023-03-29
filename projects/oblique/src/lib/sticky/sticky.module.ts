import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {ObStickyComponent} from './sticky.component';
import {obliqueProviders} from '../utilities';

export {ObStickyComponent} from './sticky.component';

@NgModule({
	imports: [CdkScrollableModule, CommonModule],
	declarations: [ObStickyComponent],
	exports: [ObStickyComponent],
	providers: obliqueProviders()
})
export class ObStickyModule {}
