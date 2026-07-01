import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-icon',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ObMockIconComponent {
	@Input() icon: string;
}
