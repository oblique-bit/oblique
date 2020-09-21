import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'ob-collapse',
	exportAs: 'orCollapse',
	template: ''
})
export class MockCollapseComponent {
	@Input() active: false;
	@Input() iconPosition: 'left' | 'right' | 'justified' = 'left';
	@Input() direction:
		| 'down-up'
		| 'down-right'
		| 'down-left'
		| 'up-down'
		| 'up-right'
		| 'up-left'
		| 'right-left'
		| 'right-up'
		| 'right-down'
		| 'left-right'
		| 'left-up'
		| 'left-down' = 'down-up';
	@Output() activeChange = new EventEmitter<boolean>();
}
