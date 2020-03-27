import {NgModule} from '@angular/core';
import {ObMockDocumentMetaService} from './mock-document-meta.service';
import {ObDocumentMetaService} from '../document-meta.module';

export {ObDocumentMetaService} from '../document-meta.service';

@NgModule({
	providers: [{provide: ObDocumentMetaService, useClass: ObMockDocumentMetaService}]
})
export class ObMockDocumentMetaModule {}
