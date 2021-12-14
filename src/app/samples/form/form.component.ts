import {Component} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-form-sample',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormSampleComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
