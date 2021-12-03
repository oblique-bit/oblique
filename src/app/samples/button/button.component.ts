import {Component} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'ob-button-sample',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ObButtonSampleComponent {
	material: Observable<boolean>;
	obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';

	constructor(masterLayout: ObMasterLayoutService, theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
