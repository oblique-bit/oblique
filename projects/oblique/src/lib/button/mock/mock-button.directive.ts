import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton'
})
export class ObMockButtonDirective {
	@Input() obButton = 'primary';
}
