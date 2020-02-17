import {Component, Input, TemplateRef} from '@angular/core';

@Component({
	selector: 'or-sticky',
	exportAs: 'orSticky',
	template: ''
})
export class MockStickyComponent {
	readonly stickyHeaderTemplate: TemplateRef<any>;
	readonly stickyMainTemplate: TemplateRef<any>;
	readonly stickyFooterTemplate: TemplateRef<any>;
	@Input() headerSize: string;
	@Input() footerSize: string;
	@Input() noLayout: boolean;
	hostClass: string;
	nestedSize = '';
}
