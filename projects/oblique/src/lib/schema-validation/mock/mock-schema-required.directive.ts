import {Directive, Input} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel]'
})
export class ObMockSchemaRequiredDirective {
	@Input('name') name: string;
	required = true;
}
