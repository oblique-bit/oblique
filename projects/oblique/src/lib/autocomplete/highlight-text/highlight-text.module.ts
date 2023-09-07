import {NgModule} from '@angular/core';

import {ObHighlightTextPipe} from './highlight-text.pipe';

@NgModule({
	imports: [ObHighlightTextPipe],
	exports: [ObHighlightTextPipe]
})
export class ObHighlightTextModule {}
