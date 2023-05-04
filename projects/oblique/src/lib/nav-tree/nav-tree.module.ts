import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {ObNavTreeComponent} from './nav-tree.component';
import {obliqueProviders} from '../utilities';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [CommonModule, MatIconModule, RouterModule, TranslateModule],
	declarations: [ObNavTreeComponent],
	providers: obliqueProviders(),
	exports: [ObNavTreeComponent]
})
export class ObNavTreeModule {}
