import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ObSearchBoxComponent} from './search-box.component';
import {ObNavTreeModule} from '../nav-tree/nav-tree.module';
import {obliqueProviders} from '../utilities';
import {ObPopoverModule} from '../popover/popover.module';

export {ObSearchBoxComponent} from './search-box.component';
export {ObISearchWidgetItem} from './search-box.model';

@NgModule({
	imports: [CommonModule, FormsModule, MatIconModule, ObNavTreeModule, ObPopoverModule, RouterModule, TranslateModule],
	declarations: [ObSearchBoxComponent],
	providers: obliqueProviders(),
	exports: [ObSearchBoxComponent]
})
export class ObSearchBoxModule {}
