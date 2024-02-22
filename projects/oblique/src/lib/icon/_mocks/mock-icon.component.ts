import {Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-icon',
	template: '',
	standalone: true
})
export class ObMockIconComponent {
	@Input() icon: string;
}
