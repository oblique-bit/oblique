import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentationPagesComponent} from './documentation-pages.component';

const routes: Routes = [{path: '', component: DocumentationPagesComponent}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DocumentationPagesRoutingModule {}
