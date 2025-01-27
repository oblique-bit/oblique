import {NgModule} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';

import {ObPaginatorService} from './ob-paginator.service';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule],
	exports: [MatPaginatorModule, ...obliqueExports],
	providers: [ObPaginatorService, {provide: MatPaginatorIntl, useClass: ObPaginatorService}, ...obliqueProviders()]
})
export class ObPaginatorModule {}
