import {Directive} from '@angular/core';

@Directive({
	selector: 'mat-form-field:has(input:not([required])), mat-form-field:has(mat-select:not([required]))'
})
export class ObMockMandatoryDirective {}
