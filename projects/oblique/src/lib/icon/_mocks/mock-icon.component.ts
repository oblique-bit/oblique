import {Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-icon',
	standalone: true,
	template: '',
})
export class ObMockIconComponent {
	@Input() icon: string;
}
