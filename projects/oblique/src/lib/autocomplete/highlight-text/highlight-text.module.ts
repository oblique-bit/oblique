import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObHighlightTextPipe} from './highlight-text.pipe';

@NgModule({
	declarations: [ObHighlightTextPipe],
	imports: [CommonModule],
	exports: [ObHighlightTextPipe]
})
export class ObHighlightTextModule {}
