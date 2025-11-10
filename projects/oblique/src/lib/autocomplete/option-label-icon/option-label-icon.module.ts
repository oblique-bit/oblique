import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';
import {ObIconModule} from './../../icon/icon.module';

@NgModule({
	imports: [CommonModule, MatIconModule, ObIconModule, ObOptionLabelIconDirective],
	exports: [ObOptionLabelIconDirective],
})
export class ObOptionLabelIconModule {}
