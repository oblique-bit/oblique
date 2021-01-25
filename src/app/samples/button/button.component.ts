import {Component} from '@angular/core';
import {ObMasterLayoutService, ObThemeService} from 'oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-button-sample',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ObButtonSampleComponent {
	material: Observable<boolean>;

	constructor(masterLayout: ObMasterLayoutService, theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
