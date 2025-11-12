import {Component, QueryList, TemplateRef} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-footer',
	standalone: false,
	template: '',
	exportAs: 'obMasterLayoutFooter',
})
export class ObMockMasterLayoutFooterComponent {
	home = '';
	isCustom = true;
	readonly templates: QueryList<TemplateRef<any>>;
}
