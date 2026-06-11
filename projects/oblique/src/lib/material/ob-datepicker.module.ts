import {NgModule} from '@angular/core';
import {MatDatepickerIntl, MatDatepickerModule} from '@angular/material/datepicker';
import {ObDatepickerIntlService} from './ob-datepicker.service';

/**
 * @deprecated since version 16.0.0. It will be removed with Oblique 17, use `provideObliqueConfiguration` instead.
 */
@NgModule({
	imports: [MatDatepickerModule],
	// This overrides the default provided by MatDatepickerModule
	providers: [{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService}],
	exports: [MatDatepickerModule],
})
export class ObDatepickerModule {}
