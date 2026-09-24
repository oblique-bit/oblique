import {ChangeDetectionStrategy, Component} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-unknown-route',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obUnknownRoute',
})
export class ObMockUnknownRouteComponent {
	homePageRoute;
}
