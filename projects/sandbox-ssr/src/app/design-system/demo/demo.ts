import {CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'ssr-demo',
	imports: [],
	templateUrl: './demo.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Demo {}
