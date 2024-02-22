import {Component} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-unknown-route',
	exportAs: 'obUnknownRoute',
	template: '',
	standalone: true
})
export class ObMockUnknownRouteComponent {
	homePageRoute;
}
