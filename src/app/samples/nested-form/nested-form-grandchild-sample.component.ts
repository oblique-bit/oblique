import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ObThemeService} from 'oblique';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-nested-form-grandchild-sample',
	exportAs: 'grandChild',
	templateUrl: './nested-form-grandchild-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class ObNestedFormGrandChildSampleComponent {
	grandChildForm: FormGroup;
	material: Observable<boolean>;

	constructor(private readonly fb: FormBuilder, theme: ObThemeService) {
		this.grandChildForm = this.fb.group({
			field1: ['', [Validators.required]],
			field2: ['', Validators.minLength(5)]
		});

		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
