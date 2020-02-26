import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[ngModel]',
})
export class ObMockSchemaRequiredDirective {
	@Input('name') name: string;
	required = true;
}
