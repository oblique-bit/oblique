import {Directive, Input, TemplateRef} from '@angular/core';
import {Options, Placement} from '@popperjs/core';

@Directive({
	selector: '[obPopover]',
	exportAs: 'obPopover',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-popover'}
})
export class ObMockPopoverDirective {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	idContent: string;

	toggle(): void {}

	close(): void {}

	open(): void {}
}
