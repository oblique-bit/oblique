import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ThemeService} from '../../common/theme.service';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-nested-form-child-td-sample',
	exportAs: 'childTD',
	templateUrl: './nested-form-child-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class ObNestedFormChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
	grandchild;
	material: Observable<boolean>;

	constructor(theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
