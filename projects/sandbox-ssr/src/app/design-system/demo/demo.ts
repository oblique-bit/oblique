import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';

@Component({
	selector: 'ssr-demo',
	imports: [],
	templateUrl: './demo.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Demo {}
