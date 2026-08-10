import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

export {ObDocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslatePipe],
})
export class ObDocumentMetaModule {}
