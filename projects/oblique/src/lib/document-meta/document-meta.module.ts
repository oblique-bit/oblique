import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {obliqueProviders} from '../utilities';

export {ObDocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslateModule],
	providers: obliqueProviders()
})
export class ObDocumentMetaModule {}
