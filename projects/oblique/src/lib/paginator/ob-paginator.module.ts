import {NgModule} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';

import {ObPaginatorService} from './ob-paginator.service';

export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule],
	exports: [MatPaginatorModule],
	providers: [ObPaginatorService, {provide: MatPaginatorIntl, useClass: ObPaginatorService}]
})
export class ObPaginatorModule {}
