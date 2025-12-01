import {Directive, Input, TemplateRef} from '@angular/core';
import {Options, Placement} from '@popperjs/core';
import {ObEToggleType} from '../popover.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obPopover]',
	standalone: true,
	host: {class: 'ob-popover'},
	exportAs: 'obPopover',
})
export class ObMockPopoverDirective {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	@Input() toggleHandle: ObEToggleType;
	@Input() closeOnlyOnToggle: boolean;
	idContent: string;

	toggle(): void {}

	handleMouseLeave(): void {}

	handleMouseEnter(): void {}

	close(): void {}

	open(): void {}
}
