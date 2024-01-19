import {NgModule} from '@angular/core';
import {ObMockDatePipe} from './mock-date.pipe';

export {ObMockDatePipe} from './mock-date.pipe';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockDatePipe],
	exports: [ObMockDatePipe]
})
export class ObMockLanguageModule {}
