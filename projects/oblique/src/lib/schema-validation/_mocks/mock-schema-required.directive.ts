import {Directive, Input} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel]',
	exportAs: 'ngModel',
	standalone: true
})
export class ObMockSchemaRequiredDirective {
	@Input() name: string;
	required = true;
}
