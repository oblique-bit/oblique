import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-column-layout',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obColumnLayout',
})
export class ObMockColumnLayoutComponent {
	readonly left = input(true);
	readonly right = input(true);
	readonly noLayout = input(false);
	readonly wider = input(false);

	toggleLeft(): void {}
	toggleRight(): void {}
}
