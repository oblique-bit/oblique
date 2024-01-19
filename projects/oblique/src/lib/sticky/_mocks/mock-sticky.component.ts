import {Component, Input, TemplateRef} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-sticky',
	exportAs: 'obSticky',
	template: '',
	standalone: true
})
export class ObMockStickyComponent {
	readonly stickyHeaderTemplate: TemplateRef<any>;
	readonly stickyMainTemplate: TemplateRef<any>;
	readonly stickyFooterTemplate: TemplateRef<any>;
	@Input() headerSize: string;
	@Input() footerSize: string;
	@Input() noLayout: boolean;
	hostClass: string;
	nestedSize = '';
}
