import {Directive, TemplateRef, input} from '@angular/core';
import {Options, Placement} from '@popperjs/core';
import {ObEToggleType} from '../popover.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obPopover]',
	host: {class: 'ob-popover'},
	exportAs: 'obPopover',
})
export class ObMockPopoverDirective {
	readonly target = input<TemplateRef<HTMLElement>>(undefined, {alias: 'obPopover'});
	readonly placement = input<Placement>('auto');
	readonly popperOptions = input<Options>({} as Options);
	readonly id = input<string>();
	readonly toggleHandle = input<ObEToggleType>();
	readonly closeOnlyOnToggle = input<boolean>();
	idContent: string;

	toggle(): void {}

	handleMouseLeave(): void {}

	handleMouseEnter(): void {}

	close(): void {}

	open(): void {}
}
