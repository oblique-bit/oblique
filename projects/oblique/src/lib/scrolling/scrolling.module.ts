import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ObTopControlComponent} from './top-control.component';
import {obliqueProviders} from '../utilities';

export {ObTopControlComponent} from './top-control.component';
export {ObScrollingEvents} from './scrolling-events';

@NgModule({
	imports: [CommonModule, MatIconModule, TranslateModule],
	declarations: [ObTopControlComponent],
	providers: obliqueProviders(),
	exports: [ObTopControlComponent]
})
export class ObScrollingModule {}
