import {NgModule} from '@angular/core';
import {ObDatePipe} from './date.pipe';
import {ObDateComponent} from './date/date.component';

export {ObDatePipe} from './date.pipe';
export {ObDateFormat} from './date/date.model';
export {ObDateComponent} from './date/date.component';

@NgModule({
	exports: [ObDatePipe, ObDateComponent],
	imports: [ObDatePipe, ObDateComponent]
})
export class ObLanguageModule {}
