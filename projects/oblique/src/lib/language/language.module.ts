import {NgModule} from '@angular/core';
import {ObDatePipe} from './date.pipe';
import {ObDateComponent} from './date/date.component';

export {ObDatePipe} from './date.pipe';
export {ObDateComponent} from './date/date.component';
export {ObDateFormat, ObTimeFormat} from './date-adapter/date.model';
export {ObILocale, ObILocaleObject} from './language.model';

@NgModule({
	imports: [ObDatePipe, ObDateComponent],
	exports: [ObDatePipe, ObDateComponent],
})
export class ObLanguageModule {}
