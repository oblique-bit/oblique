import {NgModule} from '@angular/core';
import {ObMockDatePipe} from './mock-date.pipe';

export {ObMockDatePipe} from './mock-date.pipe';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockDatePipe],
	exports: [ObMockDatePipe],
})
export class ObMockLanguageModule {}
