import {NgModule} from '@angular/core';
import {ObMockHighlightTextPipe} from './mock-highlight-text.pipe';

@NgModule({
	imports: [ObMockHighlightTextPipe],
	exports: [ObMockHighlightTextPipe]
})
export class ObMockHighlightTextModule {}
