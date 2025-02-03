import {NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';

export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule],
	exports: [MatPaginatorModule]
})
/**
 * Deprecated since Oblique 13.0.0. Import the `MatPaginatorModule` directly
 */
export class ObPaginatorModule {}
