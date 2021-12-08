import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObMasterLayoutService} from '@oblique/oblique';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-horizontal-forms-sample',
	templateUrl: './horizontal-forms.component.html'
})
export class HorizontalFormsSampleComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
