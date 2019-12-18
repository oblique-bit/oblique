import {Component, QueryList, TemplateRef} from '@angular/core';

@Component({
	selector: 'or-master-layout-footer',
	template: ''
})
export class MockMasterLayoutFooterComponent {
	home = '';
	isCustom = true;
	isSmall = true;
	readonly templates: QueryList<TemplateRef<any>>;
}

