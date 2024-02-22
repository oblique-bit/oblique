import {Component, QueryList, TemplateRef} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
