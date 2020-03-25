import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ObThemeService} from 'oblique';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app-nested-form-grandchild-td-sample',
	exportAs: 'grandChildTD',
	templateUrl: './nested-form-grandchild-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormGrandChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
	material: Observable<boolean>;

	constructor(theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
