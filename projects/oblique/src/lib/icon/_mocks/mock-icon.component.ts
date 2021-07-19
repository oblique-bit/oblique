import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
	selector: 'ob-icon',
	template: ''
})
export class ObMockIconComponent {
	@Input() icon: string;
	useFontAwesome$: Observable<boolean>;
	fontAwesomeAliases = {};
}
