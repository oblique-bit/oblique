import {NgModule} from '@angular/core';
import {MatDatepickerIntl, MatDatepickerModule} from '@angular/material/datepicker';
import {ObDatepickerIntlService} from './ob-datepicker.service';

@NgModule({
	imports: [MatDatepickerModule],
	exports: [MatDatepickerModule],
	// This overrides the default provided by MatDatepickerModule
	providers: [{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService}]
})
export class ObDatepickerModule {}
