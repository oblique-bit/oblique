import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {obliqueProviders} from '../utilities';
import {ObServiceNavigationComponent} from './service-navigation.component';

@NgModule({
	providers: [...obliqueProviders()],
	imports: [CommonModule],
	declarations: [ObServiceNavigationComponent],
	exports: [ObServiceNavigationComponent]
})
export class ObServiceNavigationModule {}
