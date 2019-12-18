import {NgModule} from '@angular/core';
import {MockDocumentMetaService} from './mock-document-meta.service';
import {DocumentMetaService} from '../document-meta.module';

export {DocumentMetaService} from '../document-meta.service';

@NgModule({
	providers: [{provide: DocumentMetaService, useClass: MockDocumentMetaService}]
})
export class MockDocumentMetaModule {
}
