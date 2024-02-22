import {NgModule} from '@angular/core';
import {ObDatePipe} from './date.pipe';

export {ObDatePipe} from './date.pipe';
export {ObLanguageService} from './language.service';

@NgModule({
	exports: [ObDatePipe],
	imports: [ObDatePipe]
})
export class ObLanguageModule {}
