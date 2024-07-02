import {Component} from '@angular/core';
import {DemoComponent} from '@oblique/design-system';

@Component({
	selector: 'ssr-test',
	standalone: true,
	imports: [DemoComponent],
	templateUrl: './test.component.html'
})
export class TestComponent {}
