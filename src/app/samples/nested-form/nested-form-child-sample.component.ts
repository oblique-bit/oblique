import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObThemeService} from 'oblique';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app-nested-form-child-sample',
	exportAs: 'child',
	templateUrl: './nested-form-child-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormChildSampleComponent {
	nestedForm: FormGroup;
	material: Observable<boolean>;

	constructor(private readonly fb: FormBuilder, theme: ObThemeService) {
		this.nestedForm = this.fb.group({
			field1: ['', [Validators.required]],
			field2: [''],
			grandchild: ''
		});
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
