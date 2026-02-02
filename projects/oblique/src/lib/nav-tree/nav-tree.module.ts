import {NgModule} from '@angular/core';

import {ObNavTreeComponent} from './nav-tree.component';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [ObNavTreeComponent],
	exports: [ObNavTreeComponent],
})
export class ObNavTreeModule {}
