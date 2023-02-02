import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';
import {ObIconModule} from './../../icon/icon.module';
import {obliqueProviders} from '../../utilities';

@NgModule({
	declarations: [ObOptionLabelIconDirective],
	imports: [CommonModule, MatIconModule, ObIconModule],
	providers: obliqueProviders(),
	exports: [ObOptionLabelIconDirective]
})
export class ObOptionLabelIconModule {}
