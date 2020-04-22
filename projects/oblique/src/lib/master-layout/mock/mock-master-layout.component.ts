import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObINavigationLink} from '../master-layout.datatypes';

@Component({
	selector: 'ob-master-layout',
	exportAs: 'obMasterLayout',
	template: ''
})
export class ObMockMasterLayoutComponent {
	home = '';
	url: string;
	@Input() navigation: ObINavigationLink[] = [];
	isFixed = true;
	hasCover = true;
	hasLayout = true;
	isMenuCollapsed = true;
	noNavigation = true;
	hasOffCanvas = true;
	footerSm = true;
	isScrolling = false;
	readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	readonly offCanvasClose: ElementRef<HTMLElement>;
}
