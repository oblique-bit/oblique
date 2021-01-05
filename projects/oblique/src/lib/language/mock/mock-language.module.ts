import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObMockDatePipe} from './mock-date.pipe';

export {ObMockDatePipe} from './mock-date.pipe';

@NgModule({
	declarations: [ObMockDatePipe],
	exports: [ObMockDatePipe],
	imports: [CommonModule]
})
export class ObMockLanguageModule {}
