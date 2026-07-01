import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'ssr-text',
	templateUrl: './text.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class Text {}
