import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-collapse',
	exportAs: 'obCollapse',
	template: '',
	standalone: true
})
export class ObMockCollapseComponent {
	static index = 0;
	@Input() active: false;
	@Input() id = `collapse-${ObMockCollapseComponent.index}`;
	@Input() duration: 'slow' | 'fast' | number = 'slow';
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	@Output() readonly activeChange = new EventEmitter<boolean>();
}
