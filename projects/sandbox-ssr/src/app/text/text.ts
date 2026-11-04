import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TextSample} from './text-sample/text-sample';

@Component({
	selector: 'ssr-text',
	imports: [TextSample],
	templateUrl: './text.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class Text {}
