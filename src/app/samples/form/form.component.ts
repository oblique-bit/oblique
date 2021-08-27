import {Component} from '@angular/core';
import {ObMasterLayoutService, ObThemeService} from '@oblique/oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-form-sample',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class ObFormSampleComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
