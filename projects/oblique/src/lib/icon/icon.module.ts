import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

export {ObIconService} from './icon.service';
export {ObIconConfig, ObEIcon} from './icon.model';

@NgModule({
	imports: [CommonModule, MatIconModule],
})

/**
 *  @deprecated since Oblique 15.2.0. It will be removed with 16.0.0
 */
export class ObIconModule {}
