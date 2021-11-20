import {Component, QueryList, TemplateRef} from '@angular/core';

@Component({
	selector: 'ob-master-layout-footer',
	exportAs: 'obMasterLayoutFooter',
	template: ''
})
export class ObMockMasterLayoutFooterComponent {
	home = '';
	isCustom = true;
	hasLogoOnScroll = true;
	readonly templates: QueryList<TemplateRef<any>>;
}
