import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-icon',
	template: '',
	standalone: true
})
export class ObMockIconComponent {
	@Input() icon: string;
}
