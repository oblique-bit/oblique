import {NgModule} from '@angular/core';
import {ObMockHighlightTextPipe} from './mock-highlight-text.pipe';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockHighlightTextPipe],
	exports: [ObMockHighlightTextPipe],
})
export class ObMockHighlightTextModule {}
