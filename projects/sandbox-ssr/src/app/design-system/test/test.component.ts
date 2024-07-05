import {Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {DemoComponent} from '@oblique/design-system';

@Component({
	selector: 'ssr-test',
	standalone: true,
	imports: [DemoComponent, TranslateModule],
	templateUrl: './test.component.html'
})
export class TestComponent {}
