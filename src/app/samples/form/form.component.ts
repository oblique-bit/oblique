import {Component} from '@angular/core';
import {ObMasterLayoutService, ObThemeService} from 'oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class ObFormComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
