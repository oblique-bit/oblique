import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DocumentationPagesRoutingModule} from './documentation-pages-routing.module';
import {DocumentationPagesComponent} from './documentation-pages.component';
import {IdModule} from '../shared/id/id.module';

@NgModule({
	declarations: [DocumentationPagesComponent],
	imports: [CommonModule, DocumentationPagesRoutingModule, IdModule]
})
export class DocumentationPagesModule {}
