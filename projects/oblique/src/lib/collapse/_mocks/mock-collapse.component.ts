import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'ob-collapse',
	exportAs: 'obCollapse',
	template: ''
})
export class ObMockCollapseComponent {
	@Input() active: false;
	@Input() duration: 'slow' | 'fast' | number = 'slow';
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	@Output() readonly activeChange = new EventEmitter<boolean>();
}
