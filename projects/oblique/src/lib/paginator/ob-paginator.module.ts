import {NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';

export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule],
	exports: [MatPaginatorModule]
})
export class ObPaginatorModule {}
