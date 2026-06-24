import {Component, TemplateRef, contentChildren} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
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
	readonly templates = contentChildren<TemplateRef<HTMLLinkElement>>('obFooterLink');
}
