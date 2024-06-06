import {Component} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ObFormFieldModule} from '@oblique/oblique';

@Component({
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ObFormFieldModule],
	selector: 'app-datepicker-example-default',
	templateUrl: './datepicker-example-default.component.html',
	providers: []
})
export class DatepickerExampleDefaultComponent {}
