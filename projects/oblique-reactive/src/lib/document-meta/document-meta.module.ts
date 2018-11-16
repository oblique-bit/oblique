import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {DocumentMetaService} from './document-meta.service';

export {DocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslateModule]
})
export class DocumentMetaModule {
}
