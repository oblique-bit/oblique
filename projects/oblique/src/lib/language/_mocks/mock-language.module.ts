import {NgModule} from '@angular/core';
import {ObMockDatePipe} from './mock-date.pipe';

export {ObMockDatePipe} from './mock-date.pipe';

@NgModule({
	imports: [ObMockDatePipe],
	exports: [ObMockDatePipe]
})
export class ObMockLanguageModule {}
