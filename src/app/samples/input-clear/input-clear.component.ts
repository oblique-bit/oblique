import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {ThemeService} from 'src/app/common/theme.service';
import {Observable, map} from 'rxjs';

@Component({
	selector: 'sc-input-clear',
	templateUrl: './input-clear.component.html'
})
export class InputClearSampleComponent implements OnInit {
	testModel1: string;
	testModel2: string;
	testModel3: string;
	testModel4: string;
	testForm: UntypedFormGroup;
	isMaterialTheme$: Observable<boolean>;

	constructor(private readonly formBuilder: UntypedFormBuilder, private readonly themeService: ThemeService) {}

	ngOnInit(): void {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});
		this.isMaterialTheme$ = this.themeService.theme$.pipe(map(() => this.themeService.isMaterial()));
	}
}
