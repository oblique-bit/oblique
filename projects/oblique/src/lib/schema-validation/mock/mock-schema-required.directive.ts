import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[ngModel]',
})
export class MockSchemaRequiredDirective {
	@Input('name') name: string;
	required = true;
}
