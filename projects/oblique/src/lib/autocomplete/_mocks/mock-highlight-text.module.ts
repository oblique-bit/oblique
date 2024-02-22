import {NgModule} from '@angular/core';
import {ObMockHighlightTextPipe} from './mock-highlight-text.pipe';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockHighlightTextPipe],
	exports: [ObMockHighlightTextPipe]
})
export class ObMockHighlightTextModule {}
