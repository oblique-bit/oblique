import {NgModule} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';

import {ObPaginatorService} from './ob-paginator.service';
import {obliqueExports, obliqueProviders} from '../utilities';
import {ObPaginatorDirective} from './paginator.directive';

export {ObPaginatorDirective} from './paginator.directive';
export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule, ObPaginatorDirective],
	exports: [MatPaginatorModule, ObPaginatorDirective, ...obliqueExports],
	providers: [ObPaginatorService, {provide: MatPaginatorIntl, useClass: ObPaginatorService}, ...obliqueProviders()]
})
export class ObPaginatorModule {}
