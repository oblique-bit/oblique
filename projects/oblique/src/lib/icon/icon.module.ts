import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

export {ObIconService} from './icon.service';
export {ObIconConfig, ObEIcon} from './icon.model';

@NgModule({
	imports: [CommonModule, MatIconModule]
})
export class ObIconModule {}
