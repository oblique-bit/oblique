import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

export {ObDocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslateModule]
})
export class ObDocumentMetaModule {}
