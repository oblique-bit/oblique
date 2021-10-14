import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {ObThemeService} from '@oblique/oblique';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-dropdown-sample',
	templateUrl: './dropdown.component.html'
})
export class ObDropdownSampleComponent {
	material: Observable<boolean>;

	constructor(theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
