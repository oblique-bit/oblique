import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {ObNavTreeComponent} from './nav-tree.component';
import {obliqueProviders} from '../utilities';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [CommonModule, FormsModule, MatIconModule, MatInputModule, RouterModule, TranslateModule],
	declarations: [ObNavTreeComponent],
	providers: obliqueProviders(),
	exports: [ObNavTreeComponent]
})
export class ObNavTreeModule {}
