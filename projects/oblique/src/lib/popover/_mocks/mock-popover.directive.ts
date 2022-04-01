import {Directive, Input, TemplateRef} from '@angular/core';
import {Options, Placement} from '@popperjs/core';
import {ObEToggleType} from '../popover.model';

@Directive({
	selector: '[obPopover]',
	exportAs: 'obPopover',
	host: {class: 'ob-popover'}
})
export class ObMockPopoverDirective {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	@Input() toggleHandle: ObEToggleType;
	idContent: string;

	toggle(): void {}

	handleMouseLeave(): void {}

	handleMouseEnter(): void {}

	close(): void {}

	open(): void {}
}
