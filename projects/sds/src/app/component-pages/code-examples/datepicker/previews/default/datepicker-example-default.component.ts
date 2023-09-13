import {MatNativeDateModule} from '@angular/material/core';
import {Component} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ObFormFieldModule} from '@oblique/oblique';

@Component({
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, ObFormFieldModule],
	selector: 'app-datepicker-example-default',
	templateUrl: './datepicker-example-default.component.html'
})
export class DatepickerExampleDefaultComponent {}
