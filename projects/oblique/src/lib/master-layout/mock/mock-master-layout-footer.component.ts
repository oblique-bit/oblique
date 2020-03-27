import {Component, QueryList, TemplateRef} from '@angular/core';

@Component({
	selector: 'ob-master-layout-footer',
	template: ''
})
export class ObMockMasterLayoutFooterComponent {
	home = '';
	isCustom = true;
	isSmall = true;
	readonly templates: QueryList<TemplateRef<any>>;
}
