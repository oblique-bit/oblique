import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObDatePipe} from './date.pipe';

export {ObDatePipe} from './date.pipe';
export {ObLanguageService} from './language.service';

@NgModule({
	declarations: [ObDatePipe],
	exports: [ObDatePipe],
	imports: [CommonModule]
})
export class ObLanguageModule {}
