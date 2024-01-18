import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {obliqueExports, obliqueProviders} from '../utilities';

export {ObDocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslateModule],
	exports: obliqueExports,
	providers: obliqueProviders()
})
export class ObDocumentMetaModule {}
