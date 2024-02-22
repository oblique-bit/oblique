import {NgModule} from '@angular/core';

import {ObNavTreeComponent} from './nav-tree.component';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [ObNavTreeComponent],
	providers: obliqueProviders(),
	exports: [ObNavTreeComponent, ...obliqueExports]
})
export class ObNavTreeModule {}
