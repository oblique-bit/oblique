import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';

@NgModule({
	imports: [CommonModule, MatIconModule, ObOptionLabelIconDirective],
	exports: [ObOptionLabelIconDirective],
})
export class ObOptionLabelIconModule {}
