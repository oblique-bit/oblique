import {ChangeDetectionStrategy, Component, Input, input, output} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-collapse',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obCollapse',
})
export class ObMockCollapseComponent {
	static index = 0;
	@Input() active: false;
	readonly id = input(`collapse-${ObMockCollapseComponent.index}`);
	@Input() duration: 'slow' | 'fast' | number = 'slow';
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	readonly activeChange = output<boolean>();
}
