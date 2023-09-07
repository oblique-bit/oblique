import {Component, Input, TemplateRef} from '@angular/core';

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
