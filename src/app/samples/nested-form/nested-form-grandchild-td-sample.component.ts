import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-nested-form-grandchild-td-sample',
	exportAs: 'grandChildTD',
	templateUrl: './nested-form-grandchild-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormGrandChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
	material: Observable<boolean>;

	constructor(theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
