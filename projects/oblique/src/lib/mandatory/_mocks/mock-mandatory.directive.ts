import {Directive} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-form-field:has(input:not([required])), mat-form-field:has(mat-select:not([required]))'
})
export class ObMockMandatoryDirective {}
