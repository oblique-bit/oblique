import {ChangeDetectionStrategy, Component, input, model} from '@angular/core';

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
	readonly active = model(false);
	readonly id = input(`collapse-${ObMockCollapseComponent.index}`);
	readonly duration = input<'slow' | 'fast' | number>('slow');
	readonly iconPosition = input<'left' | 'right' | 'justified' | 'none'>('left');
}
