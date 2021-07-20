import {Directive} from '@angular/core';

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel'
})
export class ObMockColumnPanelDirective {
	toggle(): void {}
}
