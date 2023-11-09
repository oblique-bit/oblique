import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	standalone: true
})
export class ObMockButtonDirective {
	@Input() obButton = 'primary';
}
