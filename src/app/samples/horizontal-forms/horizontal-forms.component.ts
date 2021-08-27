import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObMasterLayoutService, ObThemeService} from '@oblique/oblique';

@Component({
	selector: 'ob-horizontal-forms-sample',
	templateUrl: './horizontal-forms.component.html'
})
export class ObHorizontalFormsSampleComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
