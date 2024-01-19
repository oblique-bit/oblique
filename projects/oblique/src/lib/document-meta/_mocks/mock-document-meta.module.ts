import {NgModule} from '@angular/core';
import {ObMockDocumentMetaService} from './mock-document-meta.service';
import {ObDocumentMetaService} from '../document-meta.module';

export {ObDocumentMetaService} from '../document-meta.service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	providers: [{provide: ObDocumentMetaService, useClass: ObMockDocumentMetaService}]
})
export class ObMockDocumentMetaModule {}
