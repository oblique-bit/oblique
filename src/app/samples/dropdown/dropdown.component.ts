import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-dropdown-sample',
	templateUrl: './dropdown.component.html'
})
export class DropdownSampleComponent {
	material: Observable<boolean>;

	constructor(theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
